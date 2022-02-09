import testTable from './test.json'

function TestRoller() {
  let content = getJsonContent();
  return (
    <div>
      {content}
    </div>
  )
}

function roll(max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - 0 + 1) + 0); //The maximum is inclusive and the minimum is inclusive
}


function getJsonContent() {
  const jsonContent = testTable.content
  let componentArray = []

  for (const c in jsonContent) {
    // Read Content
    const content = jsonContent[c]
    // Get Prompt
    let prompt = content.prompt
    console.log(`Prompt ${c}: ${prompt}`)
    // Get Reponse
    let response = content.response
    console.log(`Response ${c}: ${response}`)
    let r = roll(response.length - 1)
    
    if (response[r].primary === undefined) {
      console.log(`Rolled String: ${response[r]}`)
    } else {
      console.log(`Rolled Object: ${response[r]}`)
      console.log(`Primary: ${response[r].primary}`)
      console.log(`Primary: ${response[r].secondary[roll(response[r].secondary.length - 1)]}`)
    }
    
  }
  
  return (
    <div>
      <h3>{testTable.meta.name}</h3>
      <h4>{testTable.meta.category}</h4>
      <h4>{testTable.meta.description}</h4>
      <hr></hr>
      {componentArray}
    </div>
  )
}

export default TestRoller;