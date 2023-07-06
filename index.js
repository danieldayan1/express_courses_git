const express = require('express');
const Joi = require('joi')

const app = express();
app.use(express.json());

const hostname =  process.env['HOSTNAME'] ?? '0.0.0.0';
const port = process.env["PORT"] ? Number(process.env['PORT']): 3000 ;

const courses = [{id:1,name:"math"},{id:2,name:"english"},{id:3,name:"history"}];

app.get('/',(req,res)=>{
    res.send("welcom to school courses !");
});

app.get('/api/courses',(req,res)=>{
    res.send(JSON.stringify(courses));
})

app.get('/api/courses/:id',(req,res)=>{
    const course = courses.find(c=>c.id==parseInt(req.params.id));
    if(!course) res.status(404).send('the course with the given id not found !');
    res.send(course);
})

app.post('/api/courses',(req,res)=>{

    const { error} = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    
    const course = {'id':courses.length+1, 'name':req.body.name};
    courses.push(course);
    res.send(course);

})

app.put('/api/courses/:id', (req,res)=>{
    const course = courses.find(c=>c.id==parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with the given id not found !');
    
    const { error} = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message ?? error.details[0].message);
    
    course.name = req.query.name;
    res.send(course);            
})

app.delete('api/coures/:id' , (req,res)=>{
    const course = courses.find(c=>c.id==parseInt(req.params.id));
    if(!course) return res.status(404).send('the course with the given id not found !');
    
    const index = courses.indexOf(course);
    courses.splice(index,1);
    res.send(course);
        
})


validateCourse = (course)=>{
    const schema = {name : Joi.string().min(3).required()};
    const resultReqBody = Joi.valid(course ,  schema);
    return resultReqBody ;
}


app.listen(port , hostname,()=>{console.log(`listening at http://${hostname}:${port}`)});







// const http = require('http')

// const courses = [
//     {id:1,name:"math"},{id:2,name:"english"},{id:3,name:"history"}
// ]

// const server = http.createServer((req,res)=>{
//     if(req.url === '/'){
//         res.write("courses");
//         res.end
//     }

//     if(req.url === '/api/courses'){
//         res.write(JSON.stringify(courses));
//         res.end()
//     }
// })

// server.listen(3000);

// console.log("listening on port 3000 ...")