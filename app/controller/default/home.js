'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async getArticleList() {
        let sql = 'select article.id as id,' +
                'article.title as title,' +
                'article.introduce as introduce,' +
                "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
                'article.view_count as view_count,' +
                'type.typeName as typeName ' +
                'from article left join type on article.type_id = type.id';
        const results = await this.app.mysql.query(sql);
        this.ctx.body = { data: results };
    }

    async getArticleById() {
        let id = this.ctx.params.id;
        if (id){
            let sql = 'select article.id as id,' +
                'article.title as title,' +
                'article.introduce as introduce,' +
                'article.article_content as article_content,' +
                "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
                'article.view_count as view_count,' +
                'type.typeName as typeName,' +
                'type.id as typeId ' +
                'from article left join type on article.type_id = type.id ' +
                'where article.id=' + id;
            const result = await this.app.mysql.query(sql);
            this.ctx.body = { data:result };
        }
        this.ctx.body = { data:[] };
    }

    async getTypeInfo() {
        const result = await this.app.mysql.select('type');
        this.ctx.body = { data:result };
    }

    async getListById() {
        let id = this.ctx.params.id;
        let sql = 'select article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
            'article.view_count as view_count,' +
            'type.typeName as typeName ' +
            'from article left join type on article.type_id = type.id ' +
            'where type_id=' + id;
        const results = await this.app.mysql.query(sql);
        this.ctx.body = { data: results };
    }
}

module.exports = HomeController;
