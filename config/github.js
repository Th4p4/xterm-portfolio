async function github_project(){
    const response =await fetch('https://api.github.com/users/th4p4/repos');
    const responseData = await response.json()
    // console.log(responseData)
    // responseData.forEach(element => {
    //     term.stylePrint
    // });
    return responseData
}
