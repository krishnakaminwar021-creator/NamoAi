const initApp = () => {

    // 0. PREMIUM INITIAL PRELOADER LOGIC
    const preloader = document.getElementById('preloader');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingPercentage = document.querySelector('.loading-percentage');

    if (preloader) {
        let progress = 0;
        let isLoaded = false;

        // Listen for actual full page load (including videos, fonts, CSS)
        window.addEventListener('load', () => { isLoaded = true; });
        if (document.readyState === 'complete') { isLoaded = true; }

        const interval = 25;

        const loaderTimer = setInterval(() => {
            if (!isLoaded) {
                // Fake progression up to 90% while waiting for network
                if (progress < 90) {
                    progress += Math.random() * 1.5;
                }
            } else {
                // When network finishes loading, sprint to 100%
                progress += 4;
            }

            if (progress >= 100) {
                progress = 100;
                clearInterval(loaderTimer);
                // Pause for a fraction of a second at 100% before dissolving
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    preloader.style.pointerEvents = 'none'; // STUCK BUG FAILSAFE
                }, 300);
            }

            if (loadingProgress) loadingProgress.style.width = `${progress}%`;
            if (loadingPercentage) loadingPercentage.innerText = `${Math.floor(progress)}%`;
        }, interval);
    }

    // === LENIS HIGH PERFORMANCE SMOOTH SCROLLING ===
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Integrated RequestAnimationFrame loop for Lenis that runs 60+ fps continuously
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // NAVBAR TOGGLE
    const navToggle = document.getElementById('nav-toggle');
    const navBar = document.getElementById('navbar');
    const body = document.body;

    // Initialize mobile state
    function handleResize() {
        if (window.matchMedia('(max-width: 1024px)').matches) {
            body.classList.add('nav-collapsed');
            navBar.classList.add('collapsed');
        } else {
            body.classList.remove('nav-collapsed');
            navBar.classList.remove('collapsed');
        }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            body.classList.toggle('nav-collapsed');
            navBar.classList.toggle('collapsed');
            if (!navBar.classList.contains('collapsed')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    // Close nav when clicking a link on mobile
    document.querySelectorAll('.nav-link, .nav-container .btn').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                body.classList.add('nav-collapsed');
                navBar.classList.add('collapsed');
                body.style.overflow = '';
            }
        });
    });

    // 1. STAGGERED HEADLINE ANIMATION
    const headline = document.querySelector('.hero-title');
    if (headline) {
        // Exclude the span with text-gradient from splitting to preserve HTML structure
        const textNodes = Array.from(headline.childNodes).filter(node => node.nodeType === 3);
        textNodes.forEach(node => {
            const text = node.textContent;
            if (text.trim() === '') return;

            let charIndex = 0;
            const splitText = text.split(/(\s+)/).map(word => {
                if (word.trim() === '') {
                    charIndex += word.length;
                    return word;
                }
                return `<span style="white-space: nowrap;">` + word.split('').map(char => {
                    const delay = charIndex * 0.05;
                    charIndex++;
                    return `<span class="char" style="animation-delay: ${delay}s">${char}</span>`;
                }).join('') + `</span>`;
            }).join('');

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = splitText;
            headline.insertBefore(tempDiv, node);
            headline.removeChild(node);

            // Unwrap the div
            while (tempDiv.firstChild) {
                headline.insertBefore(tempDiv.firstChild, tempDiv);
            }
            headline.removeChild(tempDiv);
        });
    }

    // Make the span letters fade in too
    if (headline) {
        const gradientSpan = headline.querySelector('.text-gradient');
        if (gradientSpan) {
            const spanText = gradientSpan.textContent;
            let charIndex = 0;
            const splitSpan = spanText.split(/(\s+)/).map(word => {
                if (word.trim() === '') {
                    charIndex += word.length;
                    return word;
                }
                return `<span style="white-space: nowrap;">` + word.split('').map(char => {
                    const delay = (charIndex * 0.05) + 0.5;
                    charIndex++;
                    return `<span class="char" style="animation-delay: ${delay}s">${char}</span>`;
                }).join('') + `</span>`;
            }).join('');
            gradientSpan.innerHTML = splitSpan;
        }
    }

    // 2. ACTIVE NAV LINK HIGHLIGHTING
    try {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } catch (e) { console.warn("Nav highlighting failed", e); }

    // Magnetic Buttons - Optimized with RequestAnimationFrame
    const magnetBtns = document.querySelectorAll('.magnet-btn');
    magnetBtns.forEach(btn => {
        let rect = null;
        let requestId = null;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const updatePosition = () => {
            // Smooth interpolation (lerp) for extra silkiness
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;
            
            btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
                requestId = requestAnimationFrame(updatePosition);
            } else {
                requestId = null;
            }
        };

        btn.addEventListener('mouseenter', function () {
            rect = this.getBoundingClientRect();
        }, { passive: true });

        btn.addEventListener('mousemove', function (e) {
            if (!rect) rect = this.getBoundingClientRect();
            targetX = (e.clientX - rect.left - rect.width / 2) * 0.35;
            targetY = (e.clientY - rect.top - rect.height / 2) * 0.35;
            
            if (!requestId) {
                requestId = requestAnimationFrame(updatePosition);
            }
        }, { passive: true });

        btn.addEventListener('mouseleave', function () {
            rect = null;
            targetX = 0;
            targetY = 0;
            if (!requestId) {
                requestId = requestAnimationFrame(updatePosition);
            }
        }, { passive: true });
    });

    // 3 & 4. OPTIMIZED HIGH-PERFORMANCE SCROLL OBSERVER
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.getElementById('navbar');

    if (scrollProgress) {
        scrollProgress.style.transformOrigin = 'left center';
    }

    let isScrolled = false;
    lenis.on('scroll', (e) => {
        // Task A: Scroll Progress Bar - Throttled by JS frame
        if (scrollProgress) {
            scrollProgress.style.transform = `scaleX(${e.progress})`;
        }

        // Task B: Navbar Glass Transition - Guarded state to prevent redundant DOM updates
        const shouldBeScrolled = e.animatedScroll > 50;
        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            if (isScrolled) {
                navbar.classList.add('scrolled');
                document.body.classList.add('scrolled-toggles');
            } else {
                navbar.classList.remove('scrolled');
                document.body.classList.remove('scrolled-toggles');
            }
        }
    });

    // 5. INTERSECTION OBSERVER FOR REVEALS & TIMELINE
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observerInstance.unobserve(entry.target); // Stop tracking once revealed for smoothness
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, #timeline').forEach(el => {
        observer.observe(el);
    });

    // 5.5 FLIP CARD LOGIC (Click-based flip)
    const flipTriggers = document.querySelectorAll('.flip-trigger');
    const flipCloses = document.querySelectorAll('.flip-close');

    flipTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.flip-card');
            if (card) {
                card.classList.add('flipped');
            }
        });
    });

    flipCloses.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.flip-card');
            if (card) {
                card.classList.remove('flipped');
            }
        });
    });

    // 6. 3D TILT EFFECT FOR CARDS
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        let rect = null;
        card.addEventListener('mouseenter', () => {
            rect = card.getBoundingClientRect();
        });
        card.addEventListener('mousemove', (e) => {
            if (!rect) rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = ((y - centerY) / centerY) * -10; // max 10deg rotation
            const tiltY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            rect = null;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 6.5 INTERACTIVE 3D CAROUSEL (Click to spread & Drag to rotate)
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselInner = document.querySelector('.carousel-inner');
    const revertBtn = document.querySelector('.revert-stack-btn');

    if (carouselWrapper && carouselInner) {
        let isDragging = false;
        let startX = 0;
        let currentRotateY = 0;
        let baseRotateY = 0;

        // Spread the cards on click if not active
        carouselWrapper.addEventListener('click', (e) => {
            // Ignore if clicking the revert button directly
            if (e.target.closest('.revert-stack-btn')) return;

            // Only toggle on the empty space or prompt, handle dragging cleanly
            if (!carouselWrapper.classList.contains('carousel-active')) {
                carouselWrapper.classList.add('carousel-active');
                if (revertBtn) revertBtn.innerText = 'Stack Cards';
                // Reset rotation when opening
                baseRotateY = 0;
                currentRotateY = 0;
                carouselInner.style.transform = `perspective(1500px) rotateX(-5deg) rotateY(0deg)`;
            }
        });

        // Revert to Stack logic
        if (revertBtn) {
            // Set initial text based on state
            revertBtn.innerText = carouselWrapper.classList.contains('carousel-active') ? 'Stack Cards' : 'Unstack Cards';
            
            revertBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent wrapper click from instantly re-opening
                const isActive = carouselWrapper.classList.contains('carousel-active');
                
                if (isActive) {
                    carouselWrapper.classList.remove('carousel-active');
                    revertBtn.innerText = 'Unstack Cards';
                } else {
                    carouselWrapper.classList.add('carousel-active');
                    revertBtn.innerText = 'Stack Cards';
                }

                // CRUCIAL BUG FIX: Snap the container rotation back to 0 so the stack isn't viewed from behind!
                baseRotateY = 0;
                currentRotateY = 0;
                carouselInner.style.transition = 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
                carouselInner.style.transform = `perspective(1500px) rotateX(-5deg) rotateY(0deg)`;

                // Optional but highly aesthetic: auto-unflip any flipped cards when stacking
                if (!isActive) { // if transitioning to stacked
                    const flippedCards = carouselWrapper.querySelectorAll('.flip-card.flipped');
                    flippedCards.forEach(card => card.classList.remove('flipped'));
                }
            });
        }

        // Mouse Drag Logic
        carouselWrapper.addEventListener('pointerdown', (e) => {
            if (!carouselWrapper.classList.contains('carousel-active')) return;
            isDragging = true;
            startX = e.clientX;
            carouselWrapper.style.cursor = 'grabbing';
            // Disable the CSS transition for immediate drag response
            carouselInner.style.transition = 'none';
        });

        window.addEventListener('pointermove', (e) => {
            if (!isDragging || !carouselWrapper.classList.contains('carousel-active')) return;

            const xMoved = e.clientX - startX;
            // Adjust sensitivity here (e.g. 0.5)
            currentRotateY = baseRotateY + (xMoved * 0.5);

            carouselInner.style.transform = `perspective(1500px) rotateX(-5deg) rotateY(${currentRotateY}deg)`;
        });

        window.addEventListener('pointerup', () => {
            if (isDragging) {
                isDragging = false;
                carouselWrapper.style.cursor = 'grab';
                baseRotateY = currentRotateY; // Save position for next drag
                // Re-enable smooth transition for releasing
                carouselInner.style.transition = 'transform 0.1s';
            }
        });

        // specific button click logic for arrows
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        const rotateCarouselBy = (degrees) => {
            // Apply a nice smooth CSS transition specifically for button clicks
            carouselInner.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
            currentRotateY += degrees;
            baseRotateY = currentRotateY;
            carouselInner.style.transform = `perspective(1500px) rotateX(-5deg) rotateY(${currentRotateY}deg)`;
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent closing the ring
                rotateCarouselBy(-60); // 360 / 6 cards = 60 degrees
            });
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent closing the ring
                rotateCarouselBy(60);
            });
        }
    }

    // 7. COUNTER UP ANIMATION
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    if (counter.animationComplete) return;

                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const step = target / (duration / 16); // 60fps
                    let current = 0;

                    if (counter.animationId) {
                        cancelAnimationFrame(counter.animationId);
                    }

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            counter.animationId = requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                            counter.animationComplete = true;
                        }
                     };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats-section');
    if (statsSection) counterObserver.observe(statsSection);

    // 8. BACKGROUND VIDEO SMOOTH PARALLAX & SLOW MOTION
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
        // Force slow motion optimally on the video element
        bgVideo.playbackRate = 0.5;

    }
    // 9. INTERACTIVE 3D CORE IN ABOUT SECTION
    const aboutWrapper = document.querySelector('.about-img-wrapper');
    const interactiveCore = document.getElementById('interactive-core');

    if (aboutWrapper && interactiveCore) {
        let aboutRect = null;
        aboutWrapper.addEventListener('mouseenter', () => {
            aboutRect = aboutWrapper.getBoundingClientRect();
        });
        aboutWrapper.addEventListener('mousemove', (e) => {
            if (!aboutRect) aboutRect = aboutWrapper.getBoundingClientRect();
            const x = e.clientX - aboutRect.left - aboutRect.width / 2;
            const y = e.clientY - aboutRect.top - aboutRect.height / 2;

            // Multiply for intensity of rotation
            const rotateX = (y / (aboutRect.height / 2)) * -25;
            const rotateY = (x / (aboutRect.width / 2)) * 25;

            interactiveCore.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        aboutWrapper.addEventListener('mouseleave', () => {
            aboutRect = null;
            interactiveCore.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }

    // 10. WHATSAPP FORM INTEGRATION
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get button to show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Connecting...';
            submitBtn.style.opacity = '0.8';

            // Gather data
            const name = this.querySelector('#form-name').value;
            const email = this.querySelector('#form-email').value;
            const mobile = this.querySelector('#form-mobile').value;
            const location = this.querySelector('#form-location').value;
            const service = this.querySelector('#form-service').value;
            const message = this.querySelector('#form-message').value;

            // Format message neatly for WhatsApp (WhatsApp supports *bold* and _italic_)
            const text = `*New Project Inquiry* 🚀\n\n` +
                `*Name:* ${name}\n` +
                `*Email:* ${email}\n` +
                `*Mobile:* ${mobile}\n` +
                `*Location:* ${location}\n` +
                `*Service Required:* ${service}\n\n` +
                `*Message:*\n${message}`;

            const encodedText = encodeURIComponent(text);
            const whatsappUrl = `https://wa.me/919579057085?text=${encodedText}`;

            // Reset button and open WhatsApp
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.opacity = '1';
                window.open(whatsappUrl, '_blank');
                contactForm.reset();
            }, 600); // Tiny delay so user feels the "Connecting..." interaction
        });
    }

    // 11. TEAM MEMBERS LOGIC
    const teamGrid = document.getElementById('team-grid');
    const openTeamModalBtn = document.getElementById('open-team-modal-btn');
    const toggleTeamViewBtn = document.getElementById('toggle-team-view-btn');
    const teamModal = document.getElementById('team-modal');
    const closeTeamModal = document.querySelector('.custom-modal-close');
    const addTeamForm = document.getElementById('add-team-form');

    const loadTeamMembers = () => {
        if (!teamGrid) return;
        const members = JSON.parse(localStorage.getItem('namoai_team_members')) || [];
        
        teamGrid.innerHTML = ''; 
        if (members.length === 0) {
            teamGrid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center; margin-top: 20px;">No team members added yet.</p>';
        }

        members.forEach((member, index) => {
            const card = document.createElement('div');
            card.className = `flip-card founder-card reveal active`;
            card.style.transitionDelay = `${(index % 4) * 0.1}s`;
            const infoText = member.info ? member.info : 'Digital Expert at Namo AI.';
            card.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front" style="padding: 40px 40px 85px 40px; text-align: left; align-items: flex-start; justify-content: space-between;">
                        <div class="stars">★★★★★</div>
                        <p class="quote">"${infoText}"</p>
                        <div class="client-info" style="margin-top:20px;">
                            <div class="client-avatar"><img src="${member.image}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👤</text></svg>'" alt="${member.name}" style="width: 70px; height: 70px; min-width: 70px; min-height: 70px; object-fit: cover; border-radius: 50%;"></div>
                            <div>
                                <div class="client-name">${member.name}</div>
                                <div class="client-position">${member.role}</div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-outline btn-sm flip-trigger hover-target" style="position: absolute; bottom: 30px; right: 30px; transform: translateZ(25px); padding: 8px 15px; font-size: 0.8rem;">Contact ➔</button>
                    </div>
                    <div class="flip-card-back">
                        <div class="client-avatar" style="margin-bottom: 20px; width:90px; height:90px;"><img src="${member.image}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👤</text></svg>'" style="width: 90px; height: 90px; object-fit: cover; border-radius: 50%;"></div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 5px; transform: translateZ(25px);">${member.name}</h3>
                        <p style="color: var(--text-muted); margin-bottom: 20px; transform: translateZ(25px);">${member.role}</p>
                        <div style="display: flex; gap: 15px; justify-content: center; transform: translateZ(30px);">
                             <a href="mailto:${member.email}" class="social-icon-btn hover-target" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
                        </div>
                        <button type="button" class="btn btn-outline btn-sm flip-close hover-target" style="margin-top: 20px; transform: translateZ(25px); padding: 8px 15px;">✕ Close</button>
                    </div>
                </div>
            `;
            teamGrid.appendChild(card);
            observer.observe(card);
        });

        // re-run flip listeners
        const newFlipTriggers = teamGrid.querySelectorAll('.flip-trigger');
        const newFlipCloses = teamGrid.querySelectorAll('.flip-close');
        
        newFlipTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const c = btn.closest('.flip-card');
                if (c) c.classList.add('flipped');
            });
        });
        
        newFlipCloses.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const c = btn.closest('.flip-card');
                if (c) c.classList.remove('flipped');
            });
        });
    };

    window.editTeamMember = (index) => {
        const password = prompt("Enter Admin Password to edit:");
        if (password !== 'Prathsaw@24') {
            alert('Incorrect Admin Password!');
            return;
        }

        const members = JSON.parse(localStorage.getItem('namoai_team_members')) || [];
        const member = members[index];
        
        if (member) {
            document.getElementById('tm-name').value = member.name;
            document.getElementById('tm-role').value = member.role;
            document.getElementById('tm-email').value = member.email || '';
            document.getElementById('tm-info').value = member.info || '';
            document.getElementById('tm-index').value = index;
            document.getElementById('modal-title-action').innerText = 'Edit';
            document.getElementById('tm-submit-btn').querySelector('span').innerText = 'Update Member';
            
            if (teamModal) teamModal.classList.add('show');
        }
    };

    if (teamModal && closeTeamModal) {
        closeTeamModal.addEventListener('click', () => {
            teamModal.classList.remove('show');
            resetTeamForm();
        });

        window.addEventListener('click', (e) => {
            if (e.target === teamModal) {
                teamModal.classList.remove('show');
                resetTeamForm();
            }
        });

        function resetTeamForm() {
            if (addTeamForm) addTeamForm.reset();
            document.getElementById('tm-index').value = "-1";
            document.getElementById('modal-title-action').innerText = 'Add';
            document.getElementById('tm-submit-btn').querySelector('span').innerText = 'Save Member';
        }
    }

    if (toggleTeamViewBtn && teamGrid) {
        let viewMembersClickCount = 0;
        let viewMembersClickTimer = null;

        toggleTeamViewBtn.addEventListener('click', (e) => {
            // If it's a link (like on index.html), let it navigate UNLESS we are doing secret taps
            const isLink = toggleTeamViewBtn.tagName === 'A';
            
            // Secret 5-Click Easter Egg for Admin Modal
            viewMembersClickCount++;
            
            clearTimeout(viewMembersClickTimer);
            
            if (viewMembersClickCount === 5) {
                if (teamModal) {
                    e.preventDefault(); // Don't navigate if achieving secret tap
                    teamModal.classList.add('show');
                    viewMembersClickCount = 0;
                    return; 
                }
            }

            // If it's on a page with a hideable grid (MPA might just want it visible)
            viewMembersClickTimer = setTimeout(() => {
                if (viewMembersClickCount > 0 && viewMembersClickCount < 5) {
                    // Only toggle if we are actually on a page that supports toggling (like team.html)
                    if (!isLink || toggleTeamViewBtn.getAttribute('href') === '#team' || toggleTeamViewBtn.getAttribute('href') === 'team.html') {
                        // If it's a relative link to another page, let it navigate
                        if (isLink && toggleTeamViewBtn.getAttribute('href').includes('.html') && window.location.pathname.includes('index.html')) {
                            return; // Let normal navigation happen
                        }

                        e.preventDefault();
                        const isHidden = teamGrid.style.display === 'none' || teamGrid.style.display === '';
                        
                        if (isHidden) {
                            teamGrid.style.display = 'grid';
                            toggleTeamViewBtn.innerText = 'HIDE MEMBERS';
                        } else {
                            teamGrid.style.display = 'none';
                            toggleTeamViewBtn.innerText = 'VIEW ALL MEMBERS';
                        }
                    }
                }
                viewMembersClickCount = 0; 
            }, 350);
        });
    }

    if (addTeamForm) {
        // Auto-fill Information based on Job Role
        const roleInput = document.getElementById('tm-role');
        const infoInput = document.getElementById('tm-info');
        
        if (roleInput && infoInput) {
            const roleInfoMap = {
                'developer': 'Building robust, scalable, and high-performance technical solutions.',
                'engineer': 'Engineering scalable, secure, and advanced software architectures.',
                'designer': 'Crafting intuitive, aesthetic, and user-centered digital experiences.',
                'ui/ux': 'Designing aesthetic interfaces and seamless digital experiences.',
                'manager': 'Driving strategic goals and empowering teams to deliver excellence.',
                'product': 'Guiding product vision and ensuring successful go-to-market strategies.',
                'marketing': 'Creating impactful campaigns that elevate brand presence and engagement.',
                'sales': 'Connecting clients with value-driven solutions to foster business growth.',
                'finance': 'Ensuring financial health and strategic resource allocation.',
                'legal': 'Safeguarding operations with robust compliance and legal foresight.',
                'hr': 'Cultivating a thriving workplace culture and championing talent.',
                'support': 'Providing exceptional assistance and ensuring customer success.',
                'content': 'Creating compelling narratives that engage and inspire audiences.',
                'default': 'Passionate about innovation and delivering outstanding results.'
            };

            roleInput.addEventListener('input', (e) => {
                const currentRole = e.target.value.toLowerCase().trim();
                let matchedInfo = '';
                
                if (currentRole === '') {
                    // Clear info if it was auto-generated and role is cleared
                    const currentInfo = infoInput.value;
                    const isPreviousAuto = Object.values(roleInfoMap).includes(currentInfo);
                    if (isPreviousAuto || currentInfo === '') infoInput.value = '';
                    return;
                }
                
                for (const [key, value] of Object.entries(roleInfoMap)) {
                    if (currentRole.includes(key)) {
                        matchedInfo = value;
                        break;
                    }
                }
                
                if (!matchedInfo) matchedInfo = roleInfoMap['default'];
                
                const currentInfo = infoInput.value;
                const isPreviousDefaultOrEmpty = currentInfo === '' || Object.values(roleInfoMap).includes(currentInfo);
                
                if (isPreviousDefaultOrEmpty) {
                    infoInput.value = matchedInfo;
                }
            });
        }

        addTeamForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const password = document.getElementById('tm-password').value;
            if (password !== 'Prathsaw@24') {
                alert('Incorrect Admin Password!');
                return;
            }

            const name = document.getElementById('tm-name').value;
            const role = document.getElementById('tm-role').value;
            const email = document.getElementById('tm-email').value;
            const info = document.getElementById('tm-info').value;
            const index = parseInt(document.getElementById('tm-index').value);
            const fileInput = document.getElementById('tm-image-file');

            const saveMember = (imageData) => {
                try {
                    const members = JSON.parse(localStorage.getItem('namoai_team_members')) || [];
                    const memberData = { name, role, email, info, image: imageData };
                    
                    if (index === -1) {
                        members.push(memberData);
                    } else {
                        // Keep old image if no new one uploaded during edit
                        if (!imageData) memberData.image = members[index].image;
                        members[index] = memberData;
                    }
                    
                    localStorage.setItem('namoai_team_members', JSON.stringify(members));
                    teamModal.classList.remove('show');
                    resetTeamForm();
                    loadTeamMembers();
                } catch (err) {
                    alert('Local Storage limit reached. Try using a smaller image.');
                    console.error('Storage Quota error: ', err);
                }
            };

            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const MAX_SIZE = 250;
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > height && width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        } else if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                        saveMember(compressedBase64);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                if (index !== -1) {
                    saveMember(null); // Edit without changing image
                } else {
                    alert("Please select an image for the new member.");
                }
            }
        });
        
        loadTeamMembers();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}