const { raw, query } = require('express');
const Tought = require('../models/Toughts')
const User = require('../models/User')

const {Op} = require('sequelize');

module.exports = class ToughtController{
    static async showToughts(req, res){

        let search = ''

        if(req.query.search){
            search = req.query.search;
        }

        let order = 'DESC'


        order = (req.query.order === 'old') ? order = 'ASC' : order = 'DESC';

        const toughtsData = await Tought.findAll({
            include: User,
            where:{
                title: {[Op.like]: `%${search}%`},
            },
            order: [['createdAt', order]],
        })

        const toughts = toughtsData.map((result)=> result.get({plain: true}))

        // const date = new Date().toLocaleDateString()

        // console.log(date)


        let toughts2 = toughtsData.map((result)=> result.dataValues.createdAt)
        
        let toughtsQty = toughts.length;

        if (toughtsQty === 0){
            toughtsQty = false;
        }


        res.render("toughts/home", {toughts, search, toughtsQty, toughts2})
   
}

    static async dashboard(req, res) {

        const userId = req.session.userid;

        const user = await User.findOne(
            {where: {
                id: userId
            },
            include: Tought,
            plain: true,
        })

        if(!user){
            res.render('/login')
        }

        const toughts = user.Toughts.map((result)=> result.dataValues)
        let emptyToughts = false;

        if (toughts.length === 0){
            emptyToughts = true;
        }
        res.render('toughts/dashboard', {toughts, emptyToughts})
    }
    static createTought(req, res, next){
            res.render('toughts/create')
    }
    static async createToughtSave(req, res){
        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
        await Tought.create(tought)
        req.flash('message', 'Pensamento criado com sucesso!')

        req.session.save(()=>{
            res.render('toughts/create')
        })
        } catch (error) {
            console.log('erro', error)
        }
    }
    static async removeTought(req, res){
        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Tought.destroy({where: {id: id, UserId: UserId}}) 

            req.flash('message', 'Pensamento removido com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard');
            })

        } catch (err) {
            console.log('ocorreu algum erro', err)
        }
    }
    static async updateTought(req, res){
        const id = req.params.id;
        

        const toughts = await Tought.findOne({where: {id: id}, raw: true})

        console.log(toughts)
        res.render('toughts/edit', {toughts})
    }
    static async updateToughtSave(req, res){
        const id = req.body.id;
        const tought ={
            title: req.body.title,
        }
        try {
            await Tought.update(tought, {where: {id: id}})
            req.flash('message', 'Pensamento editado com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard');
            })
        } catch (error) {
            console.log(error)
        }

    }
}