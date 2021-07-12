const expect = require('chai').expect
const request = require('supertest')


describe('POST GET /user', () => {

    const app = require('../app')
    it('OK, Create a new user', (done) => {
        request(app).post('/user')
            .send({
                "name": "User Test",
                "email": "usertest2@gmail.com",
                "mobileNumber": "01111202522"
            })
            .then((res) => {
                const body = res.body
                expect(body).to.contain.property('_id')
                expect(body).to.contain.property('name')
                expect(body).to.contain.property('email')
                expect(body).to.contain.property('mobileNumber')
                expect(body).to.contain.property('createdAt')
                expect(body).to.contain.property('updatedAt')
                done()
            })
            .catch(done)

    })
    it('Fail, Email is already existed', (done) => {
        request(app).post('/user')
            .send({
                "name": "User Test",
                "email": "usertest2@gmail.com",
                "mobileNumber": "01111202522"
            })
            .then((res) => {
                const body = res.body
                expect(body.errors[0].msg).to.equal('Email is already existed')
                done()
            })
            .catch(done)

    })
    it('Fail, Mobile number is already existed', (done) => {
        request(app).post('/user')
            .send({
                "name": "User Test",
                "email": "usertest3@gmail.com",
                "mobileNumber": "01111202522"
            })
            .then((res) => {
                const body = res.body
                expect(body.errors[0].msg).to.equal('Mobile number is already existed')
                done()
            })
            .catch(done)

    })
    it('Fail, it requires name, email and mobileNumber in body' , (done)=>{
        request(app).post('/user')
                    .send()
                    .then((res) =>{
                        const body = res.body
                        expect(body.errors[0].msg).to.equal('Enter your name')
                        expect(body.errors[1].msg).to.equal('Enter your email')
                        expect(body.errors[2].msg).to.equal('Enter your phone number')
                        done()  
                    })
                    .catch((err)=>done(err))
    })
    it('Fail, Enter invalid Phone Number' , (done)=>{
        request(app).post('/user')
                    .send({
                        "name": "User Test",
                        "email": "usertest3@gmail.com",
                        "mobileNumber": "02254"
                    })
                    .then((res) =>{
                        const body = res.body
                        expect(body.errors[0].msg).to.equal('Enter a Valid Mobile Number')
                        done()  
                    })
                    .catch((err)=>done(err))
    })
    it('OK, getting all users from database and has users', (done) => {
        request(app).get('/user')
            .then((res) => {
                const body = res.body

                expect(body.length).to.greaterThan(0)
                done()
            })
            .catch((err) => done(err))
    })

})
