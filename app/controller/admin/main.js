'use strict'

const Controller = require('egg').Controller;

class MainController extends Controller {
    async checkLogin() {
        let userName = this.ctx.request.body.userName;
        let password = this.ctx.request.body.password;
        const sql = `select userName from admin_user where userName = '${userName}' and password = '${password}'`;
        const result = await this.app.mysql.query(sql);
        if(result.length > 0) {
            let openId = new Date().getTime() + userName;
            this.ctx.session.openId = {'openId':openId};
            this.ctx.body = {'data':'登录成功','openId': openId}
        } else {
            this.ctx.body = {'data':'登录失败'};
        }
    }

    async getTypeInfo() {
        const resType = await this.app.mysql.select('type');
        this.ctx.body = { data: resType }
    }

    async addArticle() {
        let tmpArticle = this.ctx.request.body;
        const result = await this.app.mysql.insert('article',tmpArticle);
        const insertSuccess = result.affectedRows === 1;
        const insertId = result.insertId;

        this.ctx.body = {
            isSuccess: insertSuccess,
            insertId: insertId
        }
    }

    async updateArticle() {
        let tempArticle = this.ctx.request.body;
        const result = await this.app.mysql.update('article',tempArticle);
        const updateSuccess = result.affectedRows === 1;
        this.ctx.body = {
            isSuccess: updateSuccess
        }
    }

    async getArticleList() {
        let sql = 'select article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
            'article.view_count as view_count,' +
            'type.typeName as typeName ' +
            'from article left join type on article.type_id = type.id ' +
            'order by article.id desc';
        const results = await this.app.mysql.query(sql);
        this.ctx.body = { list: results };
    }

    async delArticle() {
        let id = this.ctx.params.id;
        const result = await this.app.mysql.delete('article',{'id':id});
        const delSuccess = result.affectedRows === 1;
        let sql = 'select article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
            'article.view_count as view_count,' +
            'type.typeName as typeName ' +
            'from article left join type on article.type_id = type.id ' +
            'order by article.id desc';
        const results = await this.app.mysql.query(sql);
        this.ctx.body = {
            list: results,
            isSuccess: delSuccess
        }
    }

    async getArticleById() {
        let id = this.ctx.params.id;
        let sql = 'select article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            "FROM_UNIXTIME(article.addTime,'%Y/%m/%d') as addTime," +
            'article.article_content as article,' +
            'type.typeName as typeName, ' +
            'type.id as typeId ' +
            'from article left join type on article.type_id = type.id ' +
            'where article.id = ' + id;
        const results = await this.app.mysql.query(sql);
        this.ctx.body = {
            data: results
        }
    }
}

module.exports = MainController