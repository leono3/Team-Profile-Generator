const inquirer = require('inquirer');
const fs = require('fs');
const generateHTML = require('./htmlGenerator.js');




const managerInquire = [
    {
        message: 'Please enter the team manager\'s name: ',
        name: 'name',
        type: 'input',
        default: 'Big Boss',

    },
    {
        message: 'Please enter the team manager\'s employee ID: ',
        name: 'id',
        type: 'input',
        default: '100',
        
    },
    {
        message: 'Please enter the team manager\'s email: ',
        name: 'email',
        type: 'input',
        default: 'BigBoss@gmail.com',
        
    },
    {
        message: 'Please enter the team manager\'s office number: ',
        name: 'office',
        type: 'input',
        default: '100',
        
    },
    {
        message: 'Do you want to add another team member? ',
        name: 'addMember',
        type: 'list',
        choices: ['yes', 'no']
        
    },
]

const memberInquire = [
    {
        message: 'Please choose the team member\'s role: ',
        name: 'role',
        type: 'list',
        choices: ['Engineer', 'Intern']

    },
    {
        message: 'Please enter the team member\'s name: ',
        name: 'name',
        type: 'input',
        default: 'Smol Boss',

    },
    {
        message: 'Please enter the team member\'s employee ID: ',
        name: 'id',
        type: 'input',
        default: '100',
        
    },
    {
        message: 'Please enter the team member\'s email: ',
        name: 'email',
        type: 'input',
        default: 'SmolBoss@gmail.com',
        
    },

    //when: (Function, Boolean) Receive the current user answers hash and should return true or false depending on whether or not this question should be asked. The value can also be a simple boolean.
    {
        message: 'Please enter the Engineer\'s github: ',
        name: 'github',
        type: 'input',
        default: 'engineer',
        when(data) {
            return data.role === "Engineer";
        },
    },
    {
        message: "What is the intern's school?",
        name: 'school',
        type: 'input',
        default: 'CalTech',
        when(data) {
            return data.role === "Intern";
        },
    },
    {
        message: 'Do you want to add another team member? ',
        name: 'addMember',
        type: 'list',
        choices: ['yes', 'no']
        
    },
    
]


async function managerQuestion() {

    //do I need to await inquirer here since init function already await managerQuestion() ?
    let managerAns = await inquirer
        .prompt(managerInquire)
        .catch(err=> console.log(err));
    return managerAns;
    }
    
    //Create memberQuestion function with default empty array for teamMember
async function memberQuestion(teamMembers = []) {

    //destructuring memberQuestion inquirer object to isolate memberAns without addMember object
    let {addMember, ...memberAns} = await inquirer
        .prompt(memberInquire)
        .catch(err=> console.log(err));

    // Spreading memberAns into memberArr    
    let memberArr = [...teamMembers, memberAns];
    return (addMember === 'no') ? memberArr : memberQuestion(memberArr)
    }

async function init(){
    let managerInfo = await managerQuestion();
    if (managerInfo.addMember === 'yes'){
        teamMembers = await memberQuestion();
    }
    writeToFile(managerInfo, teamMembers);
}

// Function that uses npm filesystem to write a new index.HTML in dist directory
function writeToFile(managerAns, memberArr) {
    fs.writeFile('index.html', generateHTML(managerAns, memberArr), err => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            console.log('Sucess!');
        }
    });
}

init();