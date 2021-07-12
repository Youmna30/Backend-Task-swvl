import notificationControllers from '../controllers/notification'

module.exports = {
    notificationService: function (io) {
        console.log("hereeee");
        global.sendNotification = io.of('/notification');
        sendNotification.on('connection', async function (socket) {
            var id = socket.handshake.query.id;
              console.log(id);
            var roomName = 'room-' + id;
            socket.join(roomName);

            console.log('Client ' + id + ' connected on notification.');
            //To Emit the count of unread notification for every user log in 
            await notificationControllers.getCountNotification(id)
            
        })
    },
}