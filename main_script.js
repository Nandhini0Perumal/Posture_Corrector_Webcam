let videofeed;
let posenet;
let poses = [];
let started = false;
var audio = document.getElementById("audioElement");

// p5.js setup() function to set up the canvas for the web cam video stream
function setup() {
  //Setting the dimensions for canvas
  const canvas = createCanvas(500, 500);
  canvas.parent("video");

  videofeed = createCapture(VIDEO);
  videofeed.size(width, height);
  console.log("setup");

  // Configuring postnet model for video feed
  posenet = ml5.poseNet(videofeed);

  posenet.on("pose", function (results) {
    poses = results;
  });

  videofeed.hide();
  noLoop();
}

// from p5.js draw function() is being called after the setup function
function draw() {
  if (started) {
    image(videofeed, 0, 0, width, height);
    calEyes();
  }
}

// Setting toggle button for start option of video feed
function start() {
  select("#startstop").html("stop");
  document.getElementById("startstop").addEventListener("click", stop);
  started = true;
  loop();
}

// Setting Toggle Button for stop
function stop() {
  select("#startstop").html("start");
  document.getElementById("startstop").addEventListener("click", start);
  removeblur();
  started = false;
  noLoop();
}

// Defining the tracking of eye parameters for posenet
var rightEye,
  leftEye,
  defaultRightEyePosition = [],
  defaultLeftEyePosition = [];


//Creating a function Using Posenet modules to calculate various keypoints
function calEyes() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      rightEye = pose.keypoints[2].position;
      leftEye = pose.keypoints[1].position;

      // Setting condition for Keypoints recognized by posenet

      while (defaultRightEyePosition.length < 1) {
        defaultRightEyePosition.push(rightEye.y);
      }

      while (defaultLeftEyePosition.length < 1) {
        defaultLeftEyePosition.push(leftEye.y);
      }

      
      // Calling Blur function when there is deviation in body position
      if (Math.abs(rightEye.y - defaultRightEyePosition[0]) > 20) {
        blur();
      }
      if (Math.abs(rightEye.y - defaultRightEyePosition[0]) < 20) {
        removeblur();
      }
    }
  }
}

//Defining blur function and Adding Audio effect
function blur() {
  document.body.style.filter = "blur(5px)";
  document.body.style.transition = "1s";
  var audio = document.getElementById("audioElement");
  console.log("change");
  audio.play();
}

//Defining removeblur function when the body comed back to initial position
function removeblur() {
  document.body.style.filter = "blur(0px)";
  var audio = document.getElementById("audioElement");

  audio.pause();
}
