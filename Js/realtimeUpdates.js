

function getRealtimeAnnouncements(code){
   var socket = io.connect('https://api.classvibes.net');
   console.log("HERE/////")

  socket.on('connect', function(data) {
    console.log("Connected to realitme - Reciever:")
    socket.emit('join-class-room', {code: code.toString()});

    socket.on('new announcement', function(data){
        console.log( data)

        var announcementHTML = `
        <a href = '/student/classes/${data.code}'><div class="toast" role="alert" data-autohide="false" aria-live="assertive" aria-atomic="true" style = 'width: 300px' data-delay="10000" id = 'announcementToast${data.code}'>
  <div class="toast-header">
    <strong class="mr-auto">${data.title}</strong>
    <small></small>
    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="toast-body" style = 'background-color: white'>
    <p style = 'max-width: 35ch; white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;'>${data.message}</p>
  </div>
</div></a>
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
