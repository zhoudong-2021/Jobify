import Job from '../models/Job.js'
import { badRequestError, notFoundError, UnauthenticatedError } from '../errors/customErrors.js'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import moment from 'moment'

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
        const job = await Job.findOne({ _id: id, createdBy })
        if (!job) return notFoundError(res, 'Unable to find this job.')

        const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        return res.status(StatusCodes.OK).json({ updatedJob })
    } catch (error) {
        next(error)
    }
}

const deleteJob = async (req, res, next) => {
    const { id } = req.params
    const createdBy = req.userId
    try {
        // Check permission
        let job = await Job.findOne({ _id: id, createdBy })
        if (!job) return notFoundError(res, 'Unable to find this job.')

        job = await Job.findByIdAndDelete(id)
        return res.status(StatusCodes.OK).json({ job })
    } catch (error) {
        next(error)
    }
}

const getAllJobs = async (req, res, next) => {
    const {search, status, jobType, sort} = req.query
    const queryObject = {
        createdBy: req.userId
    }
    if(status && status !== 'all'){
        queryObject.status = status
    }
    if(jobType && jobType !== 'all'){
        queryObject.jobType = jobType
    }
    // Search keyword case insensitive
    if(search){
        queryObject.position = {$regex: search, $options: 'i'}
    }
    let result = Job.find(queryObject)
    // Chain sort conditions
    switch(sort){
        case 'latest':
            result = result.sort('-createdAt')
            break;
        case 'oldest':
            result = result.sort('createdAt')
            break;
        case 'a-z':
            result = result.sort('position')
            break;
        case 'z-a':
            result = result.sort('-position')
            break;
    }
    try {
        const jobs = await result
        res.status(StatusCodes.OK).json({ jobs, totalJobs: jobs.length, numberOfPages: 1 })
    } catch (error) {
        next(error)
    }
}

const showStats = async (req, res, next) => {
    let stats = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ])
    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc
    }, {})

    const defaultStats = {
        "pending": stats['pending'] || 0,
        "declined": stats['declined'] || 0,
        "interview": stats['interview'] || 0
    }

    let monthlyApplications = await Job.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.userId) } },
        {
            $group: {
                _id: {
                    year: {
                        $year: '$createdAt'
                    },
                    month: {
                        $month: '$createdAt'
                    },
                },
                count: {
                    $sum : 1
                }
            }
        },
        {$sort: {'_id.year': -1, '_id.month': -1}},
        {$limit: 6}
    ])

    monthlyApplications = monthlyApplications.map(item => {
        const {_id:{year, month}, count} = item
        const date = moment()
                        .month(month-1)
                        .year(year)
                        .format('MMM Y')
        return {date, count}
                
    }).reverse()

    res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

export {
    createJob,
    deleteJob,
    getAllJobs,
    updateJob,
    showStats
}