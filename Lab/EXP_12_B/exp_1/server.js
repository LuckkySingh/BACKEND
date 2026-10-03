const express=require("express");
const session=require("express-session");
const bcrypt=require("bcrypt");

const app=express();
const PORT=3000;

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
    secret:"experiment_secret_key",
    resave:false,
    saveUninitialized:false
}));

let users=[];

app.get("/",(req,res)=>{
    if(req.session.user){
        return res.redirect("/dashboard");
    }

    res.redirect("/login");
});

app.get("/register",(req,res)=>{
    res.render("register",{message:null});
});

app.post("/register",async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const existingUser=users.find(user=>user.username===username);

    if(existingUser){
        return res.render("register",{
            message:"Username already exists"
        });
    }

    const hashedPassword=await bcrypt.hash(password,10);

    users.push({
        username:username,
        password:hashedPassword
    });

    res.redirect("/login");
});

app.get("/login",(req,res)=>{
    if(req.session.user){
        return res.redirect("/dashboard");
    }

    res.render("login",{message:null});
});

app.post("/login",async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    const user=users.find(user=>user.username===username);

    if(!user){
        return res.render("login",{
            message:"Invalid username or password"
        });
    }

    const passwordMatch=await bcrypt.compare(password,user.password);

    if(!passwordMatch){
        return res.render("login",{
            message:"Invalid username or password"
        });
    }

    req.session.user=username;

    res.redirect("/dashboard");
});

app.get("/dashboard",(req,res)=>{
    if(!req.session.user){
        return res.redirect("/login");
    }

    res.render("dashboard",{
        username:req.session.user
    });
});

app.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    });
});

app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});