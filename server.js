require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://namo-ai-website.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman and Railway internal requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// ─────────────────────────────
// DB CONNECTION CHECK
// ─────────────────────────────
db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database Connection Failed", err);
  } else {
    console.log("✅ Database Connected");
    connection.release();
  }
});

// ─────────────────────────────
// TEST ROUTE
// ─────────────────────────────
app.get("/", (req, res) => {
  res.send("NAMOAI Backend Running 🚀");
});

// ─────────────────────────────
// LOGIN ROUTE (FIXED)
// ─────────────────────────────
app.post("/api/login", async (req, res) => {
  try {

    console.log("HEADERS:", req.headers);

    console.log("BODY:", req.body);

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const [rows] = await db.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const admin = rows[0];

    if (admin.password.trim() !== password.trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",

      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {

    console.error("LOGIN ERROR:");

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//CLIENT ADD IN DB

app.post("/api/clients", async (req, res) => {
  try {
    const {
      client_name,
      company_name,
      email,
      phone,
      service_type,

      project_name,
      start_date,
      deadline,
    } = req.body;

    if (
      !client_name ||
      !email ||
      !service_type ||
      !project_name
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Insert Client
    const [clientResult] = await db.query(
      `
      INSERT INTO clients
      (
        client_name,
        company_name,
        email,
        phone,
        service_type
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        client_name,
        company_name,
        email,
        phone,
        service_type,
      ]
    );


    const clientId = clientResult.insertId;

//     console.log({
//   clientId,
//   project_name,
//   service_type,
//   start_date,
//   expected_delivery,
// });


    // Insert Project
    await db.query(
      `
      INSERT INTO projects
      (
        client_id,
        project_name,
        service_type,
        start_date,
        deadline,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        clientId,
        project_name,
        service_type,
        start_date,
        deadline,
        "active",
      ]
    );

    res.json({
      success: true,
      message: "Client and Project added successfully",
      clientId,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// GET ALL CLIENTS
app.get("/api/clients", async (req, res) => {
  try {
    const [clients] = await db.query(`
      SELECT
        id,
        client_name,
        company_name,
        email,
        phone,
        service_type,
        created_at
      FROM clients
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      clients,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// DELETE CLIENT
app.delete("/api/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM clients WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// to get project from the client to project dash.
app.get("/api/projects", async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT
        projects.*,
        clients.company_name
      FROM projects
      JOIN clients
      ON projects.client_id = clients.id
      ORDER BY projects.id DESC
    `);

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// UPDATE PROJECT STATUS
app.put("/api/projects/:id/status", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      UPDATE projects
      SET status = 'completed'
      WHERE id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Project marked as completed",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
  //
app.get("/api/dashboard", async (req, res) => {
  try {

    const [[clientCount]] = await db.query(
      "SELECT COUNT(*) AS totalClients FROM clients"
    );

    const [[projectCount]] = await db.query(
      "SELECT COUNT(*) AS totalProjects FROM projects"
    );

    const [[activeCount]] = await db.query(
      "SELECT COUNT(*) AS activeProjects FROM projects WHERE status='active'"
    );

    const [[completedCount]] = await db.query(
      "SELECT COUNT(*) AS completedProjects FROM projects WHERE status='completed'"
    );

    const [services] = await db.query(`
      SELECT
        service_type AS name,
        COUNT(*) AS total,
        SUM(status='active') AS active,
        SUM(status='completed') AS completed
      FROM projects
      GROUP BY service_type
    `);

    res.json({
      success: true,

      stats: {
        totalClients:
          clientCount.totalClients,

        totalProjects:
          projectCount.totalProjects,

        activeProjects:
          activeCount.activeProjects,

        completedProjects:
          completedCount.completedProjects,
      },

      services,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
// ─────────────────────────────
// START SERVER
// ─────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});