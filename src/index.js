const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')

const grabTableData = require('./libs/grabTableData')
const getPrId = require('./libs/getPrId')
const generateComment = require('./libs/generateComment')
const runCoverageCommand = require('./libs/runCoverageCommand')
const uploadToInflux = require('./libs/influx/upload')

const main = async () => {
  // Grab the action inputs
  const gitHubToken = core.getInput('token')
  const covCommand = core.getInput('coverage-command')
  const commentTitle = core.getInput('comment-title') || 'Unit Test Coverage Report'
  const workingDir = core.getInput('working-dir')
  // comment arguments
  const comment = core.getInput('comment')

  const fullReturn = await runCoverageCommand(covCommand, workingDir)

  // Comment on a PR
  if (comment === 'true') {
    try {
      const prNumber = getPrId()
      const codeCoverageTable = grabTableData(fullReturn)
      const commentBody = generateComment(commentTitle, codeCoverageTable)

      const octokit = github.getOctokit(gitHubToken)

      await octokit.issues.createComment({
        ...github.context.repo,
        body: commentBody,
        issue_number: prNumber
      })
    } catch (e) {
      console.error('Failed to create comment on PR')
      console.error(e)
    }
  }
  // Upload to a DB
  const upload = core.getInput('upload')
  if (upload === 'true') {
    const uploadTag = core.getInput('upload-tag')
    if (!uploadTag) {
      throw Error('upload-tag is required if upload is true')
    }
    // setup the influx info
    const influxdb = {
      auth: {
        username: core.getInput('influx-username'),
        password: core.getInput('influx-password')
      },
      host: core.getInput('influx-host'),
      db: core.getInput('influx-db'),
      series: core.getInput('influx-series')
    }
    if (!influxdb.host) {
      throw Error('influx-host is required if upload is true')
    }
    const coverageOutputPath = core.getInput('coverage-output')
    let results
    if (fs.existsSync(coverageOutputPath)) {
      results = JSON.parse(fs.readFileSync(coverageOutputPath))
    } else {
      throw Error(`${coverageOutputPath} does not exist for a coverage summary.`)
    }

    uploadToInflux({ product: uploadTag }, results, influxdb)
  }
}

main().catch(err => core.setFailed(err.message))
