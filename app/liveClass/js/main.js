var peer = new Peer(undefined, {
    port: '3001',
    host: '/'
}); 

var videoGrid = document.getElementById('video-grid')
var myVideo = document.createElement('video')

myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
    })
})


var conn = peer.connect('test');

peer.on('open', id => {
    console.log(id)
    setTimeout(function(){
        conn.send('hi!');

   }, 1000); //Time before execution
} )


  function connectToNewUser(userID, stream){
    const call = myPeer.call(userID, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(userVideoStream)
    })

    call.on('close', () => {
        video.remove()
    })
  }

  function addVideoStream(video, stream){
      video.srcObject = stream
      video.addEventListener('loadedmetadata', ()=> {
          video.play()
      })

      videoGrid.append(video)
  }

