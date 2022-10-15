const User = require('../models/User')
const bcrypt = require('bcryptjs')





module.exports = class AuthController {
    static login (req, res) {
        res.render('auth/login')
    }
    static async loginPost (req, res){
        
        
        const {email, password} = req.body;

        //finduser
        const user = await User.findOne({where: {email: email}})

        if (!user) {
            req.flash('message', 'Usuário não encontrado, tente novamente!')
            res.render('auth/login')

            return;
        }
        //checkispasswordmatch
        const passwordMatch = bcrypt.compareSync(password, user.password) 
        
        if(!passwordMatch){
            req.flash('message', 'Senha incorreta, tente novamente')
            res.render('auth/login')

            return;   
        }
        req.session.userid = user.id

        req.flash('message', `Bem vindo novamente ${user.name}`)

        req.session.save(()=>{
            res.redirect('/')
        })        

    }
    static register (req, res) {
        res.render('auth/register')
    }
    static async registerPost (req, res){
        const {name, email, password, confirmpassword} = req.body

        //passwordmatchvalidation

        if(password != confirmpassword){
            //mensagem pro front
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return;
        }

        //checkemail exist
        const checkIfUserExist = await User.findOne({where: {email: email}})

        if(checkIfUserExist){
            req.flash('message', 'O email já está em uso, tente outro!')
            res.render('auth/register')

            return;
        }

        //createapassword

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            
            const createUser = await User.create(user)

            req.session.userid = createUser.id

            req.flash('message', 'O usuário foi criado com sucesso!')

            req.session.save(()=>{
                res.redirect('/')
            })

        } catch (error) {
            console.log('ocorreu um erro', error)
        }
    }
    static logout (req, res){
        req.session.destroy()
        res.redirect('/login')
    }
}