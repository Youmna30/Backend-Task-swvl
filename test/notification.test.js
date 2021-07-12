const expect = require('chai').expect
const request = require('supertest')


describe('POST GET /notification', () => {

    const app = require('../app')
    require('../bin/www')
    it('OK, Create a new push notification to specific user', (done) => {
        request(app).post('/notification/push')
            .send({
                "notificationType":"SPECIFIC",
                "user":2,
                "text":"Test Notification"
            })
            .then((res) => {
                const body = res.body
                expect(body).to.contain.property('_id')
                expect(body).to.contain.property('isPush')
                expect(body).to.contain.property('isSms')
                expect(body).to.contain.property('text')
                expect(body).to.contain.property('users')
                expect(body).to.contain.property('read_by')
                expect(body).to.contain.property('notificationType')
                expect(body).to.contain.property('createdAt')
                expect(body).to.contain.property('updatedAt')
                done()
            })
            .catch(done)

    })
    it('OK, Create a new sms notification to specific user', (done) => {
        request(app).post('/notification/sms')
            .send({
                "notificationType":"SPECIFIC",
                "user":2,
                "text":"Test Notification"
            })
            .then((res) => {
                const body = res.body
                expect(body).to.contain.property('_id')
                expect(body).to.contain.property('isPush')
                expect(body).to.contain.property('isSms')
                expect(body).to.contain.property('text')
                expect(body).to.contain.property('users')
                expect(body).to.contain.property('read_by')
                expect(body).to.contain.property('notificationType')
                expect(body).to.contain.property('createdAt')
                expect(body).to.contain.property('updatedAt')
                done()
            })
            .catch(done)

    })
 //All the below tests work on push or sms notification Api
    it('Fail, user required in notification specific type', (done) => {
        request(app).post('/notification/push')
            .send({
                "notificationType":"SPECIFIC",
                "text":"Test Notification"
            })
            .then((res) => {
                const body = res.body
                expect(body.errors).to.equal('Choose the user to send notification')
                done()
            })
            .catch(done)

    })

    it('Fail, users required in notification Group type', (done) => {
        request(app).post('/notification/push')
            .send({
                "notificationType":"GROUP",
                "text":"Test Notification"
            })
            .then((res) => {
                const body = res.body
                expect(body.errors).to.equal('Choose the users to send them notification')
                done()
            })
            .catch(done)

    })
    it('Fail, Enter an id of non existing user in specific notification ', (done) => {
        request(app).post('/notification/push')
            .send({
                "notificationType":"SPECIFIC",
                "user":50,
                "text":"Test Notification"
            })
            .then((res) => {
                const body = res.body
                expect(body.errors[0].msg).to.equal("User isn't found")
                done()
            })
            .catch(done)

    })
   
    it('Fail, it requires notificationType and text in body' , (done)=>{
        request(app).post('/notification/sms')
                    .send()
                    .then((res) =>{
                        const body = res.body
                        expect(body.errors[0].msg).to.equal('Enter the type of the notification')
                        expect(body.errors[1].msg).to.equal('Enter the text')
                        done()  
                    })
                    .catch((err)=>done(err))
    })
    it('OK, getting all notification from database and has notifications', (done) => {
        request(app).get('/notification')
            .then((res) => {
                const body = res.body

                expect(body.length).to.greaterThan(0)
                done()
            })
            .catch((err) => done(err))
    })

})
