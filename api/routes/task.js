var express = require("express");
var router = express.Router();
const { sql, connectDB } = require("../config/dbconfig");

// ฟังก์ชันเพื่อเพิ่มงานใหม่

router.post("/add", async function (req, res) {
  const { title, description, dueDate, priority, status } = req.body;
  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("Title", sql.NVarChar, title)
      .input("Description", sql.NVarChar, description)
      .input("DueDate", sql.Date, dueDate)
      .input("Priority", sql.NVarChar, priority)
      .input("Status", sql.NVarChar, status)
      .query(
        "INSERT INTO Tasks (Title, Description, DueDate, Priority, Status) VALUES (@Title, @Description, @DueDate, @Priority, @Status)"
      );
    res.status(201).json({ message: "Task added successfully" });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).send("Failed to add task");
  }
});

// ฟังก์ชันเพื่อดูงานทั้งหมดตาม Priority
router.get("/priority/:priority", async function (req, res) {
  const { priority } = req.params;
  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("Priority", sql.NVarChar, priority)
      .query("SELECT * FROM Tasks WHERE Priority = @Priority");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error retrieving tasks by priority:", err);
    res.status(500).send("Failed to retrieve tasks by priority");
  }
});

// ฟังก์ชันเพื่อดูงานทั้งหมด
router.get("/getAllTask", async function (req, res) {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Tasks");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error retrieving all tasks:", err);
    res.status(500).send("Failed to retrieve tasks");
  }
});


// ฟังก์ชันเพื่ออัปเดตสถานะของงานตาม ID
router.put("/updateStatus/:id", async function (req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("TaskId", sql.Int, id)
      .input("Status", sql.NVarChar, status)
      .query("UPDATE Tasks SET Status = @Status WHERE TaskId = @TaskId");
    res.status(200).json({ message: "Task status updated successfully" }); // ส่งกลับ JSON
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ error: "Failed to update task status" });
  }
});

// ฟังก์ชันเพื่ออัปเดต Priority ของงานตาม ID
router.put("/updatePriority/:id", async function (req, res) {
  const { id } = req.params;
  const { priority } = req.body;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("TaskId", sql.Int, id)
      .input("Priority", sql.NVarChar, priority)
      .query("UPDATE Tasks SET Priority = @Priority WHERE TaskId = @TaskId");
    res.status(200).json({ message: "Task priority updated successfully" }); // ส่งกลับเป็น JSON
  } catch (err) {
    console.error("Error updating task priority:", err);
    res.status(500).send("Failed to update task priority");
  }
});
// ฟังก์ชันเพื่อลบงานตาม ID
router.delete("/delete/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("TaskId", sql.Int, id)
      .query("DELETE FROM Tasks WHERE TaskId = @TaskId");
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
