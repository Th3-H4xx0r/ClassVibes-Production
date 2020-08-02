

function getRealtimeAnnouncements(code){
   var socket = io.connect('https://api.classvibes.net', {transports: ['polling']});

  socket.on('connect', function(data) {
    console.log("Connected to realitme - Reciever:")
    socket.emit('join-class-room', {code: code.toString()});

    socket.on('new announcement', function(data){
        console.log( data)

        var announcementHTML = `
        <div class="toast" role="alert" data-autohide="false" aria-live="assertive" aria-atomic="true" style = 'width: 300px' data-delay="10000" id = 'announcementToast${data.code}'>
  <div class="toast-header">
    <strong class="mr-auto">${data.title}</strong>
    <small></small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <a href = '/student/classes/${data.code}' style = 'text-decoration: none; color: black'> <div class="toast-body" style = 'background-color: white'>
    <p style = 'max-width: 35ch; white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;'>${data.message}</p>
  </div></a>
</div>
        `;


        $(announcementHTML).appendTo('#toast-show-container')

        $(`.toast`).toast('show')
    })

    /*
    socket.on('connection', socket => {
        console.log("Connected to realitme - Reciever")
        socket.join(code.toString());

        socket.on('new announcement', function(data){
            console.log(data)
        })
      });
      */
});

}
