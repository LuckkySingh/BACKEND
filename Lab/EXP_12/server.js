const express=require("express");

const app=express();
const PORT=3000;

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

let users=[
    {id:1,name:"Rahul",email:"rahul@example.com"},
    {id:2,name:"Priya",email:"priya@example.com"},
    {id:3,name:"Aman",email:"aman@example.com"}
];

app.get("/",(req,res)=>{
    res.render("index",{users:users});
});

app.get("/user/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const user=users.find(item=>item.id===id);

    if(!user){
        return res.status(404).send("User not found");
    }

    res.render("user",{user:user});
});

app.get("/api/users",(req,res)=>{
    res.json(users);
});

app.get("/api/users/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const user=users.find(item=>item.id===id);

    if(!user){
        return res.status(404).json({
            message:"User not found"
        });
    }

    res.json(user);
});

app.post("/submit",(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;

    const newUser={
        id:users.length+1,
        name:name,
        email:email
    };

    users.push(newUser);

    res.render("result",{user:newUser});
});

app.post("/api/users",(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;

    const newUser={
        id:users.length+1,
        name:name,
        email:email
    };

    users.push(newUser);

    res.status(201).json({
        message:"User created successfully",
        user:newUser
    });
});

app.use((req,res)=>{
    res.status(404).send("404 - Page Not Found");
});

app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});