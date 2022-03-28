import express from "express";
import {
    createJob, 
    deleteJob, 
    getAllJobs, 
    updateJob, 
    showStats
} from '../controllers/jobsController.js'

const router = express.Router()

router.route('/').post(createJob).get(getAllJobs)
router.route('/:id').patch(updateJob).delete(deleteJob)
router.route('/stats').get(showStats)

export default router