// src/routes/projects.js
const express = require("express");
const {
  getProjects,
  getArchivedProjects,
  createProject,
  updateProject,
  archiveProject,
  unarchiveProject,
  deleteProject,
  patchProjectStatus,
} = require("../controllers/projectsController");

const router = express.Router();

// Active projects
router.get("/",               getProjects);
router.post("/",              createProject);
router.put("/:id",            updateProject);

// Status cycling
router.patch("/:id/status",   patchProjectStatus);

// Archive lifecycle
router.get("/archived",           getArchivedProjects);
router.patch("/:id/archive",      archiveProject);
router.patch("/:id/unarchive",    unarchiveProject);

// Hard delete (archived only)
router.delete("/:id",         deleteProject);

module.exports = router;
