# bluescape/code-coverage-action
This GitHub Action runs unit tests and comments on the PR with a markdown table of the code coverage.

## Currently Supported Test Tools
- `jest`
- `mocha` using `nyc`

## Usage
### Pre-requisites
A unit testing tool which can use instabul json-summary reporter: https://istanbul.js.org/docs/advanced/alternative-reporters/#json-summary

Known working tools: 
- `jest`
- `mocha` using `nyc`

## Setup
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](https://github.com/landon-martin/code-coverage-commenter/new/develop?readme=1#example-workflow) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).


### Inputs
Reference `action.yml`

## Example Workflows
### Commenting on a Pull Request
```yaml
  - name: Comment Coverage on the PR
    uses: bluescape/code-coverage-action@v0.0.3
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      coverage-command: "npm run test -- --coverage"
      comment: true
      comment-title: "Source Unit Test Coverage Report"
      working-dir: "test/e2e/page_objects"
```
This will navigate to `test/e2e/page_objects` and run the command `npm run test -- --coverage`, then parse the output of the code coverage and post it back to the PR that triggered it.

### Uploading to an InfluxDB
```yaml
  - name: Test PR Comment and Upload
    uses: bluescape/code-coverage-action@v0.0.3
    with:
      token: ${{ secrets.GITHUB_TOKEN }}
      coverage-command: 'npm run test -- --coverage'
      coverage-output: "./coverage/coverage-summary.json" # This requires the json-summary coverage reporter
      upload: true
      upload-tag: "code-coverage-action"
      influx-host: ${{ secrets.INFLUX_HOST }} # The url of the host where the influxdb is
      influx-username: admin
      influx-password: ${{ secrets.INFLUX_ALPHA}}
```
