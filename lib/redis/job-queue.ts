import { redis } from "./client"

const QUEUE_PREFIX = "queue:"
const PROCESSING_PREFIX = "processing:"
const FAILED_PREFIX = "failed:"

interface Job {
  id: string
  type: string
  data: any
  createdAt: number
  priority?: number
}

/**
 * Add a job to the queue
 */
export async function enqueueJob(queueName: string, jobType: string, jobData: any, priority = 0): Promise<string> {
  const jobId = crypto.randomUUID()
  const job: Job = {
    id: jobId,
    type: jobType,
    data: jobData,
    createdAt: Date.now(),
    priority,
  }

  const queueKey = `${QUEUE_PREFIX}${queueName}`

  // Add to sorted set with score as priority (higher priority = lower score)
  await redis.zadd(queueKey, { score: -priority, member: JSON.stringify(job) })

  return jobId
}

/**
 * Get the next job from the queue
 */
export async function dequeueJob(queueName: string): Promise<Job | null> {
  const queueKey = `${QUEUE_PREFIX}${queueName}`
  const processingKey = `${PROCESSING_PREFIX}${queueName}`

  // Get highest priority job (lowest score)
  const jobs = await redis.zpopmin(queueKey, 1)

  if (!jobs || jobs.length === 0) {
    return null
  }

  const job = JSON.parse(jobs[0].member as string) as Job

  // Move to processing set
  await redis.zadd(processingKey, { score: Date.now(), member: JSON.stringify(job) })

  return job
}

/**
 * Mark a job as completed
 */
export async function completeJob(queueName: string, jobId: string): Promise<boolean> {
  const processingKey = `${PROCESSING_PREFIX}${queueName}`

  // Find the job in the processing set
  const jobs = await redis.zrange(processingKey, 0, -1)

  for (const jobStr of jobs) {
    const job = JSON.parse(jobStr as string) as Job

    if (job.id === jobId) {
      // Remove from processing set
      await redis.zrem(processingKey, jobStr)
      return true
    }
  }

  return false
}

/**
 * Mark a job as failed
 */
export async function failJob(queueName: string, jobId: string, error: any): Promise<boolean> {
  const processingKey = `${PROCESSING_PREFIX}${queueName}`
  const failedKey = `${FAILED_PREFIX}${queueName}`

  // Find the job in the processing set
  const jobs = await redis.zrange(processingKey, 0, -1)

  for (const jobStr of jobs) {
    const job = JSON.parse(jobStr as string) as Job

    if (job.id === jobId) {
      // Add error info
      const failedJob = {
        ...job,
        error: String(error),
        failedAt: Date.now(),
      }

      // Remove from processing set
      await redis.zrem(processingKey, jobStr)

      // Add to failed set
      await redis.zadd(failedKey, { score: Date.now(), member: JSON.stringify(failedJob) })

      return true
    }
  }

  return false
}

/**
 * Retry failed jobs
 */
export async function retryFailedJobs(queueName: string, limit = 10): Promise<number> {
  const queueKey = `${QUEUE_PREFIX}${queueName}`
  const failedKey = `${FAILED_PREFIX}${queueName}`

  // Get failed jobs
  const failedJobs = await redis.zrange(failedKey, 0, limit - 1)

  if (!failedJobs || failedJobs.length === 0) {
    return 0
  }

  let count = 0

  for (const jobStr of failedJobs) {
    const job = JSON.parse(jobStr as string) as Job

    // Remove error and failedAt
    const { error, failedAt, ...cleanJob } = job as any

    // Add back to queue
    await redis.zadd(queueKey, { score: -cleanJob.priority || 0, member: JSON.stringify(cleanJob) })

    // Remove from failed set
    await redis.zrem(failedKey, jobStr)

    count++
  }

  return count
}
