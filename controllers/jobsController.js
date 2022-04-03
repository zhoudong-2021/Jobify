import Job from '../models/Job.js'
import { badRequestError, notFoundError, UnauthenticatedError } from '../errors/customErrors.js'
import { StatusCodes } from 'http-status-codes'

const createJob = async (req, res, next) => {
    const { company, position } = req.body
    if (!company || !position) {
        return badRequestError(res, 'Please provide company name and position.')
    }
    req.body.createdBy = req.userId
    try {
        const job = await Job.create(req.body)
        res.status(StatusCodes.CREATED).json({ job })
    } catch (error) {
        next(error)
    }
}

const updateJob = async (req, res, next) => {
    const { id } = req.params
    const createdBy = req.userId
    try {
        // Check permission
        const job = await Job.findOne({_id: id, createdBy})
        if(!job) return notFoundError(res, 'Unable to find this job.')
        
        const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        return res.status(StatusCodes.OK).json({updatedJob})
    } catch (error) {
        next(error)
    }
}

const deleteJob = async (req, res, next) => {
    const { id } = req.params
    const createdBy = req.userId
    try {
        // Check permission
        let job = await Job.findOne({_id: id, createdBy})
        if(!job) return notFoundError(res, 'Unable to find this job.')
        
        job = await Job.findByIdAndDelete(id)
        return res.status(StatusCodes.OK).json({job})
    } catch (error) {
        next(error)
    }
}

const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ createdBy: req.userId })
        res.status(StatusCodes.OK).json({ jobs, totalJobs: jobs.length, numberOfPages: 1 })
    } catch (error) {
        next(error)
    }
}

const showStats = async (req, res, next) => {
    res.send('showStats')
}

export {
    createJob,
    deleteJob,
    getAllJobs,
    updateJob,
    showStats
}