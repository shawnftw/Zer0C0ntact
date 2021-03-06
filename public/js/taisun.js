// Taisun Launch page
// Client side javascript


// Initiate a websocket connection to the server
var host = window.location.hostname; 
var port = window.location.port;
var protocol = window.location.protocol;
var converter = new showdown.Converter({parseImgDimensions: true});
var socket = io.connect(protocol + '//' + host + ':' + port, {});
// If the page is being loaded for the first time render in the homepage
$(document).ready(function(){renderstacks()})

//// Dashboard Page rendering ////
function renderhome(){
  $('.nav-item').removeClass('active');
  $('#pagecontent').empty();
  $('#pageheader').empty();
  $('#pagecontent').append('<center><i class="fas fa-spinner fa-pulse" style="font-size:36px"></i><br><h2>Getting Server Info</h2></center>');
  socket.emit('getdashinfo');
}
socket.on('renderdash', function(response){
  var containers = response.containers;
  var images = response.images;
  var cpustats = response.cpu;
  var cpupercent = response.CPUpercent;
  var memstats = response.mem;
  var usedmem = (memstats.active/memstats.total)*100;
  var totalmem = parseFloat(memstats.total/1000000000).toFixed(2);
  var diskbuffer = parseFloat(memstats.buffcache/1000000000).toFixed(2);
  var stackcount = 0;
  var vdicount = 0;
  var devcount = 0;
  var gateway = 0;
  var termcount = 0;
  $(containers).each(function(index,container){
    var labels = container.Labels;
    if (labels.stacktype){
      var stacktype = labels.stacktype;
      if (stacktype == 'vdi'){
        vdicount++;
      }
      else if (stacktype == 'developer'){
        devcount++;
      }
      else if (stacktype == 'community'){
        stackcount++;
      }
      else if (stacktype == 'gateway'){
        gateway++;
      }
      else if (stacktype == 'terminal'){
        termcount++;
      }
    }
  }).promise().done(function(){
    if (gateway == 0){
      var gatewaystatus = 'Not Running';
    }else{
      var gatewaystatus = 'Running';
    }
    $('#pagecontent').empty();
    $('#pagecontent').append('\
    <div class="card mb-3">\
      <div class="card-header">\
        <i class="fa fa-server"></i>\
        System Stats\
      </div>\
      <div class="card-body card-deck">\
        <div class="card mb-3">\
          <div class="card-header">\
            <i class="fa fa-microchip"></i>\
            CPU\
          </div>\
          <div class="card-body">\
          <table class="table table-hover">\
            <tr><td>CPU</td><td>' + cpustats.manufacturer + ' ' + cpustats.brand + '</td></tr>\
            <tr><td>Cores</td><td>' + cpustats.cores + '</td></tr>\
            <tr><td>Usage</td><td><div class="progress"><div class="progress-bar" role="progressbar" style="width: ' + cpupercent + '%;" aria-valuenow="' + cpupercent + '" aria-valuemin="0" aria-valuemax="100"></div></div></td></tr>\
          </table>\
          </div>\
        </div>\
        <div class="card mb-3">\
          <div class="card-header">\
            <i class="fa fa-microchip"></i>\
            Memory\
          </div>\
          <div class="card-body">\
          <table class="table table-hover">\
            <tr><td>Total Mem</td><td>' + totalmem + 'G</td></tr>\
            <tr><td>Disk buffer</td><td>' + diskbuffer + 'G</td></tr>\
            <tr><td>Usage</td><td><div class="progress"><div class="progress-bar" role="progressbar" style="width: ' + usedmem + '%;" aria-valuenow="' + usedmem + '" aria-valuemin="0" aria-valuemax="100"></div></div></td></tr>\
          </table>\
          </div>\
        </div>\
      </div>\
    </div>\
    <div class="card-deck">\
      <div class="card mb-3" style="cursor:pointer;" onclick="renderstacks()">\
        <div class="card-header">\
          <i class="fa fa-cubes"></i>\
          Taisun Stacks\
          <span style="float:right;">' + stackcount + '</span>\
        </div>\
      </div>\
      <div class="card mb-3" style="cursor:pointer;" onclick="renderimages()">\
        <div class="card-header">\
          <i class="far fa-hdd"></i>\
          Images\
          <span style="float:right;">' + images.length + '</span>\
        </div>\
      </div>\
    </div>\
    <div class="card-deck">\
      <div class="card mb-3" style="cursor:pointer;" onclick="rendervdi()">\
        <div class="card-header">\
          <i class="fa fa-desktop"></i>\
          VDI Containers\
          <span style="float:right;">' + vdicount + '</span>\
        </div>\
      </div>\
      <div class="card mb-3" style="cursor:pointer;" onclick="renderdeveloper()">\
        <div class="card-header">\
          <i class="fa fa-code"></i>\
          Developer Containers\
          <span style="float:right;">' + devcount + '</span>\
        </div>\
      </div>\
    </div>\
    <div class="card-deck">\
      <div class="card mb-3" style="cursor:pointer;" onclick="renderterminals()">\
        <div class="card-header">\
          <i class="fa fa-terminal"></i>\
          Terminal Containers\
          <span style="float:right;">' + termcount + '</span>\
        </div>\
      </div>\
      <div class="card mb-3" style="cursor:pointer;" onclick="renderremote()">\
        <div class="card-header">\
          <i class="fa fa-sitemap"></i>\
          Remote Access Status\
          <span style="float:right;">' + gatewaystatus + '</span>\
        </div>\
      </div>\
    </div>\
    ');
  });
});

//// VDI Page rendering ////
function rendervdi (){
  $('.nav-item').removeClass('active');
  $('#VDInav').addClass('active');
  $('#pagecontent').empty();
  $('#pageheader').empty();
  socket.emit('checkguac', 'rendervdi');
}
socket.on('rendervdi', function(response){
  if (response == "no"){
    $('#pagecontent').append('\
    <div class="card mb-3">\
      <div class="card-header">\
        <i class="fa fa-desktop"></i>\
        VDI Management\
      </div>\
      <div class="card-body">\
        <center>\
          <h2>To run virtual desktops you must first launch Guacamole Server</h2>\
          <br>\
          <button type="button" class="btn btn-lg btn-primary guacdlaunch" data-toggle="modal" data-target="#modal">Launch Now</button>\
        </center>\
      </div>\
    </div>\
    ');
  }
  else if (response == "yes"){
    $('#pageheader').append('\
    <div class="row">\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white configurestack" style="cursor:pointer;" value="http://localhost:3000/public/taisuntemplates/taisunvdi.yml">\
          <div class="card text-white bg-success o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="far fa-fw fa-plus-square"></i>\
              </div>\
              <div class="mr-5">\
                Launch Desktop\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white" style="cursor:pointer;" onclick="stackdestroymodal()">\
          <div class="card text-white bg-danger o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="fa fa-fw fa-minus-circle"></i>\
              </div>\
              <div class="mr-5">\
                Destroy Desktop\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white" style="cursor:pointer;" onclick="guacstatusmodal()">\
          <div class="card text-white bg-success o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="far fa-fw fa-thumbs-up"></i>\
              </div>\
              <div class="mr-5">\
                GuacD\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
    </div>\
    ');
    $('#pagecontent').append('\
    <div class="card mb-3">\
      <div class="card-header">\
        <i class="fa fa-desktop"></i>\
        Deployed Desktops\
      </div>\
      <div style="overflow-x:auto" class="card-body" id="vdistacks">\
      <center><i class="fas fa-spinner fa-pulse" style="font-size:36px"></i><br><h2>Fetching Info from Taisun</h2></center>\
      </div>\
    </div>\
    ');
    socket.emit('getvdi', '1');
  }
});
// Whenever the stack list is updated rebuild the displayed table
socket.on('updatevdi', function(containers) {
  updatevdi(containers);
});
function updatevdi(containers){
  $('#vdistacks').empty();
  $('#vdistacks').append('\
  <table style="width:100%" id="vdiresults" class="table table-hover">\
    <thead>\
      <tr>\
        <th>Name</th>\
        <th>URL</th>\
        <th>Image</th>\
        <th>Status</th>\
        <th>Logs</th>\
        <th>Manage</th>\
      </tr>\
    </thead>\
  </table>\
  ');
  //Loop through the containers to build the containers table
  var vdicontainers = [];
  $(containers).each(function(index,container){
    var labels = container.Labels;
    if (labels.stacktype){
      var stacktype = labels.stacktype;
      if (stacktype == 'vdi'){
        vdicontainers.push(container);
      }
    }
  }).promise().done(function(){
    // No VDI containers found
    if (vdicontainers.length == 0){
      $('#vdistacks').empty();
      $('#vdistacks').append('<center><h2>No VDI Containers found</h2><br><button type="button" data-toggle="modal" data-target="#modal" class="btn btn-primary configurestack" style="cursor:pointer;" value="http://localhost:3000/public/taisuntemplates/taisunvdi.yml" >Add Desktop <i class="fa fa-plus-square"></i></button></center>');
    }
    // Found some VDI containers
    else{
      // Loop through the VDIs deployed to show them on the vdi page
      $("#vdiresults").dataTable().fnDestroy();
      var desktoptable = $('#vdiresults').DataTable( {} );
      desktoptable.clear();
      $(vdicontainers).each(function(index, container) {
          var labels = container.Labels;
          if (container.State == 'running'){
            var management = '<button type="button" style="cursor:pointer;" data-toggle="modal" data-target="#modal" class="btn btn-sm btn-primary stackrestartbutton" value="' + labels.stackname + '">Restart <i class="fas fa-fw fa-sync"></i></button>' + '<button type="button" style="cursor:pointer;" data-toggle="modal" data-target="#modal" class="btn btn-sm btn-danger stackstopbutton" value="' + labels.stackname + '">Stop <i class="fa fa-fw fa-stop"></i></button>';
          }
          else{
            var management = '<button type="button" style="cursor:pointer;" data-toggle="modal" data-target="#modal" class="btn btn-sm btn-primary stackstartbutton" value="' + labels.stackname + '">Start <i class="fa fa-fw fa-play"></i></button>';
          }
          desktoptable.row.add( 
            [
              labels.stackname, 
              '<a href="/desktop/' + container.Id + '" target="_blank" class="btn btn-sm btn-primary">Launch</a>',
              container.Image, 
              container.State + ' ' + container.Status, 
              '<button type="button" style="cursor:pointer;" data-toggle="modal" data-target="#modal" class="btn btn-sm btn-primary containerlogsbutton" value="' + container.Id + '">Logs <i class="fa fa-fw fa-terminal"></i></button>',
              management
            ]
          );
      }).promise().done(function(){desktoptable.draw();});
    }
  });
}

// When the guacd button is pressed tell the server to launch guacd docker container
$('body').on('click', '.guacdlaunch', function(){
  socket.emit('launchguac');
  modalpurge();
  $('#modaltitle').append('Launching GuacD');
  $('#modalloading').show();
});
// Parse output from the server on status of launching Guacd
socket.on('modal_update', function(message) {
  $('#modalconsole').show();
  $('#modalconsole').append('<div>' + message + '</div>');
});
socket.on('modal_finish', function(message) {
  $('#modalloading').hide();
  setTimeout(location.reload.bind(location), 5000);
  $('#modalconsole').append('<div>' + message + '</div>');
});
// Form to build a container from git repo
function gitmodal(){
  modalpurge();
  $('#modaltitle').append('Import Project from Git');
  $('#modalbody').show();
  $('#modalbody').append('\
  <div class="form-group row">\
  <label for="desktop-destroy" class="col-sm-2 control-label">Repo</label>\
    <div class="col-sm-10">\
    <input type="text" class="form-control" id="build-repo" placeholder="IE: https://github.com/Taisun-Docker/taisun.git">\
    </div>\
  </div>\
  <div class="form-group row">\
  <label for="desktop-destroy" class="col-sm-2 control-label">Path to Dockerfile</label>\
    <div class="col-sm-10">\
    <input type="text" class="form-control" id="build-path" placeholder="Relative path IE: docker/, leave empty for root">\
    </div>\
  </div>\
  <div class="form-group row">\
  <label for="desktop-destroy" class="col-sm-2 control-label">Checkout</label>\
    <div class="col-sm-10">\
    <input type="text" class="form-control" id="build-checkout" placeholder="Branch or Tag, leave empty for master">\
    </div>\
  </div>\
  <div class="form-group row">\
  <label for="desktop-destroy" class="col-sm-2 control-label">Image Tag</label>\
    <div class="col-sm-10">\
    <input type="text" class="form-control" id="build-tag" placeholder="IE: mycontainer:mytag">\
    </div>\
  </div>\
  ');
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>\
  <button type="button" class="btn btn-success" onclick="buildfromgit()">Build</button>\
  ');
}
// Send git build context to server
function buildfromgit(){
  var repo = $('#build-repo').val();
  var path = $('#build-path').val();
  var checkout = $('#build-checkout').val();
  var tag = $('#build-tag').val();
  socket.emit('builddockergit', [repo,path,checkout,tag]);
  modalpurge();
  $('#modaltitle').append('Building ' + repo);
  $('#modalloading').show();
}

// Guacstatus modal
function guacstatusmodal(){
  modalpurge();
  $('#modaltitle').append('Guacamole server info');
  $('#modalloading').show();
  socket.emit('getguacinfo');
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-danger" onclick="destroycontainer(\'guacd\')">Destroy GuacD</button>\
  ');
}
socket.on('guacinfo', function (data){
  $('#modalloading').hide();
  $('#modalconsole').show();
  $('#modalconsole').append('\
    <div> State: '+ data.State.Status + '</div>\
    <div> Created: '+ data.Created + '</div>\
  ');
});

// Destroy a single container
function destroycontainer(name){
  modalpurge();
  $('#modaltitle').append('Destroying ' + name);
  $('#modalloading').show();
  socket.emit('destroycontainer', name);
}

// When the desktop form is submitted send the reqest to the server
function createdesktop(){
  socket.emit('createdesktop', $('#desktopname').val(),$('#socket').val());
}

//// Launch Page rendering ////
function renderimages(){
  $('.nav-item').removeClass('active');
  $('#ImagesNav').addClass('active');
  $('#pagecontent').empty();
  $('#pageheader').empty();
  $('#pageheader').append('\
  <div class="row">\
    <div class="col-xl-3 col-sm-6 mb-3" id="local" style="cursor:pointer;" onclick="renderlocal()">\
        <div class="card text-white bg-info o-hidden h-60">\
          <div class="card-body">\
            <div class="card-body-icon">\
              <i class="far fa-fw fa-hdd"></i>\
            </div>\
            <div class="mr-5">\
              Local Images\
            </div>\
          </div>\
      </div>\
    </div>\
    <div class="col-xl-3 col-sm-6 mb-3" id="dockerhub" style="cursor:pointer;" onclick="renderdockerhub()">\
        <div class="card text-white bg-info o-hidden h-60">\
          <div class="card-body">\
            <div class="card-body-icon">\
              <i class="fab fa-fw fa-docker"></i>\
            </div>\
            <div class="mr-5">\
              DockerHub\
            </div>\
          </div>\
      </div>\
    </div>\
    <div class="col-xl-3 col-sm-6 mb-3">\
        <div data-toggle="modal" data-target="#modal" class="card text-white bg-info o-hidden h-60" style="cursor:pointer;" onclick="gitmodal()">\
          <div class="card-body">\
            <div class="card-body-icon">\
              <i class="fab fa-fw fa-git-square"></i>\
            </div>\
            <div class="mr-5">\
              From Git\
            </div>\
          </div>\
      </div>\
    </div>\
    <div class="col-xl-3 col-sm-6 mb-3">\
        <div class="card text-white bg-info o-hidden h-60" onclick="window.open(\'https://stacks.taisun.io\');" style="cursor:pointer;">\
          <div class="card-body">\
            <div class="card-body-icon">\
              <i class="fa fa-fw fa-cubes"></i>\
            </div>\
            <div class="mr-5">\
              stacks.taisun.io\
            </div>\
          </div>\
      </div>\
    </div>\
  </div>\
  ');
  renderlocal();
}
// Local Images
function renderlocal(){
  $('#pagecontent').empty();
  $('#pagecontent').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="far fa-hdd"></i>\
      Local Images\
    </div>\
    <div class="card-body">\
      <div class="table-responsive">\
        <table id="images" class="table table-hover" width="100%" cellspacing="0">\
          <thead>\
            <tr>\
              <th>Image</th>\
              <th>ID</th>\
              <th>Created</th>\
              <th>Size</th>\
              <th>Launch</th>\
            </tr>\
          </thead>\
        </table>\
      </div>\
    </div>\
  </div>');
  socket.emit('getimages');
  // When the server sends us the images on this machine render in the rows
  socket.on('sendimages', function(images) {
    $("#images").dataTable().fnDestroy();
    var imagestable = $('#images').DataTable( {} );
    imagestable.clear();
    //Loop through the images to build the images table
    for (i = 0; i < images.length; i++){
      var image = images[i];
      if (image.RepoTags){
        // Do not show dangling images
        if (image.RepoTags[0] != '<none>:<none>'){
          imagestable.row.add(
            [image.RepoTags[0],
            image.Id.split(':')[1].substring(0,12),
            new Date( image.Created * 1e3).toISOString().slice(0,19), 
            (image.Size / 1000000) + ' MB', 
            '<button type="button" style="cursor:pointer;" class="btn btn-primary btn-xs configuregeneric" data-toggle="modal" data-target="#modal" value="' + image.RepoTags[0] + '">Launch <i class="fa fa-rocket"></i></button>']
          );
        }
      }
    }
    imagestable.draw();
  });
}
// Dockerhub Page
function renderdockerhub(){
  $('#pagecontent').empty();
  $('#pagecontent').append('\
  <form class="form-inline mb-3" onsubmit="return false;">\
    <div class="input-group">\
      <input type="text" class="form-control" placeholder="Search" id="hubsearch">\
      <div class="input-group-btn">\
        <button onclick="dockersearch(1)" type="button" class="btn btn-default"><i class="fa fa-search"></i></button>\
      </div>\
    </div>\
  </form>\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fab fa-docker"></i>\
      DockerHub\
    </div>\
    <div class="card-body" style="overflow-x:auto" id="dockerresults">\
    <center><h2>Please search for Docker images</h2></center>\
    </div>\
  </div>');
  document.getElementById("hubsearch").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) { 
      dockersearch(1);
    }
  });
}

// Developer Page
function renderdeveloper(){
  $('.nav-item').removeClass('active');
  $('#DeveloperNav').addClass('active');
  $('#pageheader').empty();
  $('#pagecontent').empty();
  $('#pageheader').append('\
    <div class="row">\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white configurestack" style="cursor:pointer;" value="http://localhost:3000/public/taisuntemplates/taisundeveloper.yml">\
          <div class="card text-white bg-success o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="far fa-fw fa-plus-square"></i>\
              </div>\
              <div class="mr-5">\
                Launch Developer Container\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white" style="cursor:pointer;" onclick="stackdestroymodal()">\
          <div class="card text-white bg-danger o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="fa fa-fw fa-minus-circle"></i>\
              </div>\
              <div class="mr-5">\
                Destroy Developer Container\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
    </div>\
  ');
  $('#pagecontent').empty();
  $('#pagecontent').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fa fa-play"></i>\
      Running Developer Containers\
    </div>\
    <div class="card-body" id="devstacks" style="overflow-x:auto">\
    <center><i class="fas fa-spinner fa-pulse" style="font-size:36px"></i><br><h2>Fetching developer containers from Taisun</h2></center>\
    </div>\
  </div>\
  ');
  socket.emit('getdev', '1');
}
// When the server sends us the container information render the table in
socket.on('updatedev', function(containers){
  updatedev(containers);
});
function updatedev(containers){
  $('#devstacks').empty();
  $('#devstacks').append('<table style="width:100%" id="devresults" class="table table-hover"><thead><tr><th>Name</th><th>URL</th><th>Language</th><th></th><th>Status</th><th>Created</th><th></th></tr></thead></table>');
  var devcontainers = [];
  $(containers).each(function(index,container){
    var labels = container.Labels;
    if (labels.stacktype){
      var stacktype = labels.stacktype;
      if (stacktype == 'developer'){
        devcontainers.push(container);
      }
    }
  }).promise().done(function(){
    // No Dev containers found render launcher
    if (devcontainers.length == 0){
      $('#devstacks').empty();
      $('#devstacks').append('<center><h2>No Running Development Containers</h2><br><button type="button" data-toggle="modal" data-target="#modal" style="cursor:pointer;" class="btn btn-primary configurestack" value="http://localhost:3000/public/taisuntemplates/taisundeveloper.yml">Launch Developer Container <i class="far fa-plus-square"></i></button></center>');
    }
    // Found some dev containers
    else{
      // Loop through the VDIs deployed to show them on the vdi page
      $("#devresults").dataTable().fnDestroy();
      var devtable = $('#devresults').DataTable( {} );
      devtable.clear();
      //Loop through the containers to build the developer table
      $(devcontainers).each(function(index, container) {
      var labels = container.Labels;
        var host = window.location.hostname;
        devtable.row.add( 
          [labels.stackname, 
          '<a href="http://' + host + ':' + labels.devport + '" target="_blank" class="btn btn-sm btn-primary">Launch</a>',
          labels.devlanguage,
          '<button type="button" style="cursor:pointer;" data-toggle="modal" data-target="#modal" class="btn btn-sm btn-primary containerlogsbutton" value="' + container.Id + '">Logs <i class="fas fa-file-alt"></i></button>',
          container.State + ' ' + container.Status, 
          new Date( container.Created * 1e3).toISOString().slice(0,19),
          '<button type="button" style="cursor:pointer;" data-toggle="modal" data-target="#modal" class="btn btn-sm btn-primary stackrestartbutton" value="' + labels.stackname + '">Restart <i class="fas fa-fw fa-sync"></i></button>']
        );          
      }).promise().done(devtable.draw());
    }
  });
}

// Terminals Page
function renderterminals(){
  $('.nav-item').removeClass('active');
  $('#TerminalsNav').addClass('active');
  $('#pageheader').empty();
  $('#pagecontent').empty();
  $('#pageheader').append('\
    <div class="row">\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white configurestack" style="cursor:pointer;" value="http://localhost:3000/public/taisuntemplates/taisuntmux.yml">\
          <div class="card text-white bg-success o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="far fa-fw fa-plus-square"></i>\
              </div>\
              <div class="mr-5">\
                Launch Terminal Container\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white" style="cursor:pointer;" onclick="stackdestroymodal()">\
          <div class="card text-white bg-danger o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="fa fa-fw fa-minus-circle"></i>\
              </div>\
              <div class="mr-5">\
                Destroy Terminal Container\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
    </div>\
  ');
  $('#pagecontent').empty();
  $('#pagecontent').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fa fa-play"></i>\
      Running Terminal Containers\
    </div>\
    <div class="card-body" id="termstacks" style="overflow-x:auto">\
    <center><i class="fas fa-spinner fa-pulse" style="font-size:36px"></i><br><h2>Fetching terminal containers from Taisun</h2></center>\
    </div>\
  </div>\
  ');
  socket.emit('getterm', '1');
}
// When the server sends us the container information render the table in
socket.on('updateterm', function(containers){
  updateterm(containers);
});
function updateterm(containers){
  $('#termstacks').empty();
  $('#termstacks').append('<table style="width:100%" id="termresults" class="table table-hover"><thead><tr><th>Name</th><th>Launch</th><th>Status</th><th>Created</th></tr></thead></table>');
  var termcontainers = [];
  $(containers).each(function(index,container){
    var labels = container.Labels;
    if (labels.stacktype){
      var stacktype = labels.stacktype;
      if (stacktype == 'terminal'){
        termcontainers.push(container);
      }
    }
  }).promise().done(function(){
    // No Terminal containers found render launcher
    if (termcontainers.length == 0){
      $('#termstacks').empty();
      $('#termstacks').append('<center><h2>No Running Terminal Containers</h2><br><button type="button" data-toggle="modal" data-target="#modal" style="cursor:pointer;" class="btn btn-primary configurestack" value="http://localhost:3000/public/taisuntemplates/taisuntmux.yml">Launch Terminal Container <i class="far fa-plus-square"></i></button></center>');
    }
    // Found some Terminal containers
    else{
      // Loop through the terminals deployed to show them on the terminal page
      $("#termresults").dataTable().fnDestroy();
      var termtable = $('#termresults').DataTable( {} );
      termtable.clear();
      //Loop through the containers to build the Terminal table
      $(termcontainers).each(function(index, container) {
        var id = container.Id;
        var labels = container.Labels;
        var host = window.location.hostname;
        termtable.row.add( 
          [labels.stackname, 
          '<button type="button" style="cursor:pointer;margin-right:10px;" class="btn btn-sm btn-primary" onclick="window.open(\'/terminal/' + id + '\',\'_blank\');">Terminal <i class="fa fa-fw fa-terminal"></i></button>',
          container.State + ' ' + container.Status, 
          new Date( container.Created * 1e3).toISOString().slice(0,19)] 
        );
      }).promise().done(termtable.draw());
    }
  });
}

//// DockerHub Search ////
// When search button is activated send string to server
function dockersearch(page){
  $('#dockerresults').empty();
  // Set the content to a spinner to signify loading
  $('#dockerresults').append('<i class="fas fa-spinner fa-pulse" style="font-size:36px"></i>');
  socket.emit('searchdocker', $('#hubsearch').val(), page);
}
// When the server gives us the results parse them
socket.on('hubresults', function(data) {
  $('#dockerresults').empty();
  // If we did not get an results do not create table
  if (data.num_results == 0){
    $('#dockerresults').append('<center><h2>No Results</h2></center>');
  }
  else {
    // Create table for dockerhub results
    $('#dockerresults').append('<table style="width:100%" id="hubresults" class="table table-hover"></table>');
    $('#hubresults').append('<thead><tr><th>Name</th><th>Rating</th><th>Description</th><th></th></tr></thead>');
    for (i = 0; i < data.results.length; i++){
      var name = data.results[i].name;
      var description = data.results[i].description;
      var stars = data.results[i].star_count;
      $('#hubresults').append('<tr><td>' + name + '</td><td>' + '<i class="far fa-star"></i>' + stars + '</td><td>' + description + '</td><td><button type="button" data-toggle="modal" data-target="#modal" style="cursor:pointer;" class="btn btn-primary btn-xs hubinfo" value="' + name + '"><i class="fa fa-download"></i> Pull</button></td></tr>')
    }
    // Pagination logic show +2 and -2 pages at the bottom of the table
    $('#dockerresults').append('<ul id="dockerhubpages" class="pagination"></ul>');
    for (i = -2; i < 3; i++){
      var pagenumber = parseInt(data.page) + i;
      // If negative page number do not display 
      if ( pagenumber <= 0){
      }
      // If current page highlight current
      else if ( pagenumber == data.page){
        $('#dockerhubpages').append('<li class="page-item active"><a class="page-link" onclick="dockersearch(' + pagenumber + ')">' + pagenumber + '</a></li>');
      }
      // If not current page
      else if (parseInt(data.num_pages) - pagenumber >= 0){
        $('#dockerhubpages').append('<li class="page-item"><a class="page-link" onclick="dockersearch(' + pagenumber + ')">' + pagenumber + '</a></li>');
      }
    }
  }
});

//// Get supplimental info on the dockerhub container
$('body').on('click', '.hubinfo', function(){
  socket.emit('gethubinfo', $(this).attr("value"));
  modalpurge();
  $('#modaltitle').append($(this).attr("value").replace('_/','') + ' Image Information' );
  $('#modalloading').show();
});
// Render in info page for image on pull modal
socket.on('sendhubinfo', function(data) {
  $('#modalloading').hide();
  $('#modalbody').show();
  if (data.user == 'library'){
    var user = '_';
  }
  else{
    var user = data.user;
  }
  var name = data.name;
  var pullcount = data.pull_count;
  var stars = data.star_count;
  var description = data.description;
  $('#modalbody').append('\
  <div class="row">\
    <div class="col-lg-8">' +
      description + '<br><br>\
      <ul class="list-group" style="width:30%;">\
        <li class="list-group-item justify-content-between">Stars <span class="badge badge-primary badge-pill pull-right">' + stars + '</span></li>\
        <li class="list-group-item justify-content-between">Pulls <span class="badge badge-primary badge-pill pull-right">' + pullcount + '</span></li>\
      </ul><br>\
    </div>\
    <div class="col-lg-4"><br><center>\
      <button type="button" style="cursor:pointer;" class="btn btn-success btn-xs pullimage" value="' + (user + '/' + name).replace('_/','') + ':latest' + '"><i class="fa fa-download"></i> Pull Latest</button><br><br>\
      <button type="button" style="cursor:pointer;" class="btn btn-primary btn-xs browsetags" value="' + user + '/' + name + '"><i class="fa fa-eye"></i> Browse Tags</button><br><br>\
    </center></div>\
  </div>');
  $('#modalbody').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fa fa-book"></i>\
      Full Description\
    </div>\
    <div class="card-body">' + 
    converter.makeHtml(data.full_description) +
    '</div>\
  </div>');
});
// When the tags modal is launched clear it out and ask the server for the info
$('body').on('click', '.browsetags', function(){
  socket.emit('gettags', $(this).attr("value"));
  modalpurge();
  $('#modaltitle').append($(this).attr("value").replace('_/','') + ' Repo Tags' );
  $('#modalloading').show();
});
// When the server sends tag info populate tags modal
socket.on('sendtagsinfo', function(arr) {
  var data = arr[0];
  var name = arr[1];
  $('#modalloading').hide();
  $('#modalbody').show();
  $('#modalbody').append('<table style="width:100%" id="tagsresults" class="table table-hover"></table>');
  $('#tagsresults').append('<thead><tr><th>Name</th><th>Size</th><th>Updated</th><th></th></tr></thead>');
  for (i = 0; i < data.length; i++){
    var tag = data[i].name;
    var size = data[i].full_size;
    var updated = data[i].last_updated;
    $('#tagsresults').append('<tr><td>' + tag + '</td><td>' + (size / 1000000) + ' MB' + '</td><td>' + updated + '</td><td><button type="button" style="cursor:pointer;" class="btn btn-primary btn-xs pullimage" value="' + name.replace('_/','') + ':' + tag  + '"><i class="fa fa-download"></i> Pull</button></td></tr>')
  }  
});
// Pull image at specific tag
$('body').on('click', '.pullimage', function(){
  socket.emit('sendpullcommand', $(this).attr("value"));
  modalpurge();
  $('#modalloading').show();
});
// Show console output Docker commands from dockerode
socket.on('senddockerodeoutstart', function(output) {
  $('#modalbody').show();
  $('#modalbody').append('<div><i class="fa fa-check"></i> ' + output + '</div>');
  $('#modalconsole').show();
  $('#modalconsole').height('60vh');
});
socket.on('senddockerodeout', function(output) {
  var stream = output.stream;
  var status = output.status;
  if (stream){
    $('#modalconsole').append('<div>' + stream + '</div>');
  }
  else{
    if (output.hasOwnProperty("id")){
      var uuid = output.id;
      // If the Div exists we are going to be updating it
      if ($('#' + uuid).length > 0) {
        if (output.hasOwnProperty("progress")){
          var progress = output.progress;
          $('#' + uuid).empty();
          $('#' + uuid).append(uuid + ' : ' + status + ' ' +  progress);
        }
        else{
          $('#' + uuid).empty();
          $('#' + uuid).append(uuid + ' : ' + status);        
        }
      }
      // Div does not exist create it and put the data in it
      else{
        $('#modalconsole').append('<div id="' + uuid + '">' + uuid + ' : ' + status + '</div>');
      }
    }
    else{
      $('#modalconsole').append('<div>' + status + '</div>');
    }
  }
  // Scroll to the bottom of the console output
  var toscroll = $("#modalconsole").get(0);
  toscroll.scrollTop = toscroll.scrollHeight;
});
socket.on('senddockerodeoutdone', function(output) {
  $('#modalloading').hide();
  $('#modalbody').append('<div><i class="fa fa-check"></i> ' + output + '</div>');
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-success" data-dismiss="modal">Close <i class="fa fa-check"></i></button>\
  ');
  // Scroll to the bottom of the console output
  var toscroll = $("#modalconsole").get(0);
  toscroll.scrollTop = toscroll.scrollHeight;
});

// Show Basic output in modal
socket.on('sendmodalstart', function(output) {
  $('#modalbody').show();
  $('#modalbody').append('<div><i class="fa fa-check"></i> ' + output + '</div>');
});
socket.on('sendmodalend', function(output) {
  $('#modalloading').hide();
  $('#modalbody').append('<div><i class="fa fa-check"></i> ' + output + '</div>');
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-success" data-dismiss="modal">Close <i class="fa fa-check"></i></button>\
  ');  
});

//// Taisun Stacks Rendering
// Stacks Page
function renderstacks(){
  $('.nav-item').removeClass('active');
  $('#StacksNav').addClass('active');
  $('#pageheader').empty();
  $('#pageheader').append('\
 <div class="row">\
    <div class="col-xl-3 col-sm-6 mb-3" id="local" style="cursor:pointer;" onclick="renderstacks()">\
        <div class="card text-white bg-info o-hidden h-60">\
          <div class="card-body">\
            <div class="card-body-icon">\
              <i class="fa fa-fw fa-play"></i>\
            </div>\
            <div class="mr-5">\
              Active Browsers\
            </div>\
          </div>\
      </div>\
    </div>\
    <div class="col-xl-3 col-sm-6 mb-3" id="dockerhub" style="cursor:pointer;" onclick="renderbrowsestacks()">\
        <div class="card text-white bg-info o-hidden h-60">\
          <div class="card-body">\
            <div class="card-body-icon">\
              <i class="fa fa-fw fa-download"></i>\
            </div>\
            <div class="mr-5">\
              Start Browsers\
            </div>\
          </div>\
      </div>\
    </div>\
  ');
  $('#pagecontent').empty();
  $('#pagecontent').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fa fa-play"></i>\
      Active Browsers\
    </div>\
    <div style="overflow-x:auto" class="card-body" id="localstacks">\
    <center><i class="fas fa-spinner fa-pulse" style="font-size:36px"></i><br><h2>Fetching running stacks from Taisun</h2></center>\
    </div>\
  </div>\
  ');
  socket.emit('getstacks', '1');
}
// When the server sends us the running stacks render
socket.on('localstacks', function(containers) {
  updatelocalstacks(containers);
});
function updatelocalstacks(containers){
  $('#localstacks').empty();
  $('#localstacks').append('\
  <table style="width:100%" id="stackresults" class="table table-hover">\
    <thead>\
      <tr>\
        <th>Name</th>\
        <th>App Launch</th>\
        <th>Status</th>\
        <th>Created</th>\
        <th>Manage</th>\
      </tr>\
    </thead>\
  </table>\
  ');
  var stackcontainers = [];
  $(containers).each(function(index,container){
    var labels = container.Labels;
    if (labels.stacktype){
      var stacktype = labels.stacktype;
      if (stacktype == 'container' || stacktype == 'community'){
        stackcontainers.push(container);
      }
    }
  }).promise().done(function(){
    // No Stack containers found with apport defined
    if (stackcontainers.length == 0){
      $('#localstacks').empty();
      $('#localstacks').append('<center><h2>No Running Stacks</h2><br><button type="button" style="cursor:pointer;" class="btn btn-primary" onclick="renderbrowsestacks()" >Browse Stacks <i class="fa fa-download"></i></button></center>');
    }
    // Found some stack containers
    else{
      // Loop through the stacks to render them
      $("#stackresults").dataTable().fnDestroy();
      var stacktable = $('#stackresults').DataTable( {} );
      stacktable.clear();
      //Loop through the containers
      $(stackcontainers).each(function(index, container) {
        var labels = container.Labels;
        var host = window.location.hostname;
        var apport = labels.appport;
        if (apport){
          // This is being accessed remote do not show links
          if (host.includes('taisun.io')){
            var launch = '<button class="btn btn-sm btn-danger">NA Remote <i class="far fa-times-circle" aria-hidden="true"></i></button>';
            addrowlocal(launch, container, labels, stacktable);
          }
          // Handle stacks without ports
          else if (apport == 'NA'){
            var launch = '<button class="btn btn-sm btn-danger">NA <i class="far fa-times-circle" aria-hidden="true"></i></button>';
            addrowlocal(launch, container, labels, stacktable);
          }
          // Local mode show links
          else{
            if (isNaN(apport)){
              var dropdownlinks = '';
              var ports = JSON.parse(apport);
              $(ports).each(function( key, value ){
                dropdownlinks += '<a class="dropdown-item" href="http://' + host + ':' + value[Object.keys(value)[0]] + '" target="_blank">' + Object.keys(value)[0] + '</a>';
              }).promise().done( function(){
                var launch = '<div class="dropdown">\
                                <button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-toggle="dropdown">\
                                  Open\
                                </button>\
                                <div class="dropdown-menu">\
                                  ' + dropdownlinks + '\
                                </div>\
                              </div>';
                addrowlocal(launch, container, labels, stacktable);
              });
            }
            else{
              if (labels.https){
                var launch = '<a href="https://' + host + ':' + labels.appport + '" target="_blank" class="btn btn-sm btn-primary">Open <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>';
              }
              else{
                var launch = '<a href="http://' + host + ':' + labels.appport + '" target="_blank" class="btn btn-sm btn-primary">Open <i class="fas fa-external-link-alt" aria-hidden="true"></i></a>';
              }
            }
          }
        }
        else{
          var launch = 'Not Set';
        }
        if ( labels.stacktype == 'community' && launch == 'Not Set' || isNaN(apport) ){
          // Community Stacks without ports set, set logic for this if they are single container stacks
        }
        else if  (!host.includes('taisun.io')){
          addrowlocal(launch, container, labels, stacktable);
        }
      }).promise().done(stacktable.draw());
    }
  });
}
// Add the rows to the table to be rendered
function addrowlocal(launch, container, labels, stacktable){
  stacktable.row.add(
    [
      labels.stackname,
      launch,
      container.State + ' ' + container.Status,
      new Date( container.Created * 1e3).toISOString().slice(0,19),
      '<button type="button" style="cursor:pointer;" class="btn btn-sm" onclick="managestack(\'' + labels.stackname + '\')">Manage <i class="fas fa-fw fa-edit"></i></button></div>'
    ]
  );
}

// When manage stack is clicked render the information for the stack in question
function managestack(stackname){
  $('#pagecontent').empty();
  $('#pagecontent').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fas fa-edit"></i>\
      Manage ' + stackname + '\
    </div>\
    <div style="overflow-x:auto" class="card-body" id="' + stackname + '">\
      <div id="manageheader">\
        <center><i class="fas fa-spinner fa-pulse" style="font-size:36px"></i><br><h2>Fetching info from Taisun</h2></center>\
      </div>\
    </div>\
  </div>\
  ');
  socket.emit('getmanage', '1');
}
// When we get container info render in the stack management page
socket.on('manageinfo', function(containers) {
  $(containers).each(function(index,container){
    
    var labels = container.Labels;
    // Check if the div for this stack name exists
    if($('#' + labels.stackname).length != 0) {
      var id = container.Id;
      var name = container.Names[0];
      var mounts = container.Mounts;
      var ports = container.Ports;
      if (labels.stackurl){
        var url = labels.stackurl;
      }
      else{
        var url = 'Not Set';
      }
      $('#manageheader').empty();
      $('#manageheader').append('\
     <div class="row">\
        <div class="col-xl-2 col-sm-6 mb-3" data-toggle="modal" data-target="#modal" style="cursor:pointer;" onclick="upgradestack(\'' + labels.stackname + '\')">\
            <div class="card text-white bg-success o-hidden h-60">\
              <div class="card-body">\
                <div class="card-body-icon">\
                  <i class="fa fa-fw fa-arrow-up"></i>\
                </div>\
                <div class="mr-5">\
                  Update All\
                </div>\
              </div>\
          </div>\
        </div>\
        <div class="col-xl-2 col-sm-6 mb-3" data-toggle="modal" data-target="#modal" style="cursor:pointer;" onclick="stackrestart(\'' + labels.stackname + '\')">\
            <div class="card text-white bg-info o-hidden h-60">\
              <div class="card-body">\
                <div class="card-body-icon">\
                  <i class="fas fa-fw fa-sync"></i>\
                </div>\
                <div class="mr-5">\
                  Restart All\
                </div>\
              </div>\
          </div>\
        </div>\
        <div class="col-xl-2 col-sm-6 mb-3" data-toggle="modal" data-target="#modal" style="cursor:pointer;" onclick="stackstop(\'' + labels.stackname + '\')">\
            <div class="card text-white bg-danger o-hidden h-60">\
              <div class="card-body">\
                <div class="card-body-icon">\
                  <i class="fa fa-fw fa-stop"></i>\
                </div>\
                <div class="mr-5">\
                  Stop All\
                </div>\
              </div>\
          </div>\
        </div>\
        <div class="col-xl-2 col-sm-6 mb-3" data-toggle="modal" data-target="#modal" style="cursor:pointer;" onclick="stackstart(\'' + labels.stackname + '\')">\
            <div class="card text-white bg-success o-hidden h-60">\
              <div class="card-body">\
                <div class="card-body-icon">\
                  <i class="fa fa-fw fa-play"></i>\
                </div>\
                <div class="mr-5">\
                  Start All\
                </div>\
              </div>\
          </div>\
        </div>\
        <div class="col-xl-2 col-sm-6 mb-3">\
        </div>\
        <div class="col-xl-2 col-sm-6 mb-3" data-toggle="modal" data-target="#modal" style="cursor:pointer;" onclick="stackdestroymodal()">\
            <div class="card text-white bg-danger o-hidden h-60">\
              <div class="card-body">\
                <div class="card-body-icon">\
                  <i class="fa fa-fw fa-minus-circle"></i>\
                </div>\
                <div class="mr-5">\
                  Destroy Browser\
                </div>\
              </div>\
          </div>\
        </div>\
      </div>\
      ');
      $('#' + labels.stackname).append('\
        <div class="card mb-3">\
          <div class="card-header">\
            <i class="fab fa-docker"></i>\
            Container ' + name + ' <button type="button" style="cursor:pointer;" data-toggle="modal" data-target="#modal" class="btn btn-sm btn-primary containerlogsbutton float-right" value="' + id + '">Logs <i class="fas fa-file-alt"></i></button> <button type="button" style="cursor:pointer;margin-right:10px;" class="btn btn-sm btn-primary float-right" onclick="window.open(\'/terminal/' + id + '\',\'_blank\');">Terminal <i class="fa fa-fw fa-terminal"></i></button>\
          </div>\
          <div style="overflow-x:auto" class="card-body" id="' + id + '">\
            <div class="card mb-3">\
              <div class="card-header">\
                <i class="fas fa-bullseye"></i>\
                Status\
              </div>\
              <div style="overflow-x:auto" class="card-body" id="status_' + id + '"></div>\
            </div>\
            <div class="row">\
              <div class="col-sm-6">\
                <div class="card mb-3">\
                  <div class="card-header">\
                    <i class="far fa-hdd"></i>\
                    Volumes\
                  </div>\
                  <div style="overflow-x:auto" class="card-body" id="volumes_' + id + '"></div>\
                </div>\
              </div>\
              <div class="col-sm-6">\
                <div class="card mb-3">\
                  <div class="card-header">\
                    <i class="fas fa-sitemap"></i>\
                    Port Binding\
                  </div>\
                  <div style="overflow-x:auto" class="card-body" id="ports_' + id + '"></div>\
                </div>\
              </div>\
            </div>\
          </div>\
        </div>\
      ').ready(function () {
        $('#status_' + id).append('\
        <table class="table">\
          <tr>\
            <td>Stack URL</td>\
            <td>' + url + '</td>\
          </tr>\
          <tr>\
            <td>Status</td>\
            <td>' + container.State + ' ' + container.Status + '</td>\
          </tr>\
          <tr>\
            <td>Image</td>\
            <td>' + container.Image + '</td>\
          </tr>\
          <tr>\
            <td>Created</td>\
            <td>' + new Date( container.Created * 1e3).toISOString().slice(0,19) + '</td>\
          </tr>\
          <tr>\
            <td>Command</td>\
            <td>' + container.Command + '</td>\
          </tr>\
        </table>\
        ');
        $('#volumes_' + id).append('\
        <table class="table" id="vtable_' + id + '">\
          <tr>\
            <th>Host Mountpoint</td>\
            <th>Container Mountpoint</th>\
          </tr>\
        </table>\
        ').ready(function () {
          for (i = 0; i < mounts.length; i++){
            $('#vtable_' + id).append('\
            <tr>\
              <td>' + mounts[i].Source + '</td>\
              <td>' + mounts[i].Destination + '</td>\
            </tr>\
            ');
          }
        });
        $('#ports_' + id).append('\
        <table class="table" id="ptable_' + id + '">\
          <tr>\
            <th>Host Port</td>\
            <th>Container Port</th>\
          </tr>\
        </table>\
        ').ready(function () {
          for (i = 0; i < ports.length; i++){
            $('#ptable_' + id).append('\
            <tr>\
              <td>' + ports[i].PublicPort + ' ' + ports[i].Type + '</td>\
              <td>' + ports[i].PrivatePort + ' ' + ports[i].Type + '</td>\
            </tr>\
            ');
          }
        });
      });
    }
  });
});

// When the upgrade button is clicked send to server
function upgradestack(stackname){
  modalpurge();
  $('#modalloading').show();
  $('#modalconsole').show();
  socket.emit('upgradestack',stackname);
}
$('body').on('click', '.stackupgradebutton', function(){
  modalpurge();
  $('#modalloading').show();
  $('#modalconsole').show();
  socket.emit('upgradestack',$(this).attr("value"));
});

// When the restart button is clicked send to server
function stackrestart(stackname){
  modalpurge();
  $('#modalloading').show();
  $('#modalconsole').show();
  socket.emit('restartstack',stackname);
}
$('body').on('click', '.stackrestartbutton', function(){
  stackrestart($(this).attr("value"));
});

// When the stop button is clicked send to server
function stackstop(stackname){
  modalpurge();
  $('#modalloading').show();
  $('#modalconsole').show();
  socket.emit('stopstack',stackname);
}
$('body').on('click', '.stackstopbutton', function(){
  stackstop($(this).attr("value"));
});

// When the start button is clicked send to server
function stackstart(stackname){
  modalpurge();
  $('#modalloading').show();
  $('#modalconsole').show();
  socket.emit('startstack',stackname);
}
$('body').on('click', '.stackstartbutton', function(){
  stackstart($(this).attr("value"));
});

// When the logs button is clicked send to server
$('body').on('click', '.containerlogsbutton', function(){
  modalpurge();
  $('#modalloading').show();
  $('#modalconsole').show();
  socket.emit('containerlogs',$(this).attr("value"));
});

// When the user clicks to browse remote stack yaml files render and ask the server for the results
function renderbrowsestacks(){
  $('#pagecontent').empty();
  $('#pagecontent').append('\
  <div class="row">\
    <div class="col-6">\
      <form class="form-inline mb-3" onsubmit="return false;">\
        <div class="input-group">\
          <input type="text" class="form-control" placeholder="Search" id="stacksearch">\
          <div class="input-group-btn">\
            <button onclick="stacksearch(1)" type="button" class="btn btn-default"><i class="fa fa-search"></i></button>\
          </div>\
        </div>\
      </form>\
    </div>\
    <div class="col-6">\
      <form class="form-inline mb-3" onsubmit="return false;">\
        <div class="input-group col-12">\
          <input type="text" class="form-control" placeholder="From Endpoint" id="stackurl">\
          <div class="input-group-btn">\
            <button id="stackurlbutton" data-toggle="modal" data-target="#modal" type="button" class="btn btn-default stackurlbutton"><i class="fa fa-download"></i></button>\
          </div>\
        </div>\
      </form>\
    </div>\
  </div>\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fa fa-bars"></i>\
     ZC Browsers\
    </div>\
    <div style="overflow-x:auto" class="card-body" id="taisunstacks">\
    <center><i class="fas fa-spinner fa-pulse" style="font-size:36px"></i><br><h2>Fetching available stacks from Taisun.io</h2></center>\
    </div>\
  </div>\
  ');
  socket.emit('browsestacks', '1');
  document.getElementById("stacksearch").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) { 
      stacksearch(1);
    }
  });
  document.getElementById("stackurl").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) { 
      document.getElementById("stackurlbutton").click();
    }
  });
}

// When the configure button is clicked send the URL to the server and give the user a spinner
$('body').on('click', '.stackurlbutton', function(){
  var endpoint = $('#stackurl').val();
  socket.emit('sendstackurl', endpoint);
  modalpurge();
  $('#modaltitle').append('Pulling definition from ' + endpoint);
  $('#modalloading').show();
});

// When the server gives us the stacks parse them
socket.on('stacksresults', function(data) {
  $('#taisunstacks').empty();
  // If the file is invalid show error
  if (data.stacktemplates == null || data.stacktemplates == undefined){
    $('#taisunstacks').append('<center><h2>Error Fetching file</h2></center>');
  }
  else {
    // Create table for taisun results
    $('#taisunstacks').append('<table style="width:100%" id="stackstable" class="table table-hover"></table>');
    // Browser Window
    if ($(window).width() > 500){
      $('#stackstable').append('\
        <thead>\
          <tr>\
            <th></th>\
            <th>Name</th>\
            <th>Description</th>\
            <th>Downloads</th>\
            <th></th>\
          </tr>\
        </thead>\
        <tbody id="stacksbody"></tbody>');
      for (i = 0; i < data.stacktemplates.length; i++){
        var name = data.stacktemplates[i].name;
        var description = data.stacktemplates[i].description;
        var iconurl = data.stacktemplates[i].icon;
        var dataurl = data.stacktemplates[i].stackdata;
        var downloads = data.stacktemplates[i].downloads;
        var user = data.stacktemplates[i].user;
        var exstackurl = 'https://stacks.taisun.io/?stack=' + dataurl.replace('https://stacks.taisun.io/templates/','');
        $('#stacksbody').append('\
          <tr height="130">\
            <td><center><img src="' + iconurl + '"></center></td>\
            <td><a href="' + exstackurl + '" target="_blank">' + name + '</a></td>\
            <td>' + description + '</td>\
            <td>' + downloads + '</td>\
            <td><button type="button" data-toggle="modal" data-target="#modal" style="cursor:pointer;" class="btn btn-primary btn-xs configurestack" value="' + dataurl + '">Configure and Launch <i class="fa fa-rocket"></i></button></td>\
          </tr>');
      }
    }
    // Mobile Table
    else{
      $('#stackstable').append('\
        <thead>\
          <tr>\
            <th>Name</th>\
            <th>Downloads</th>\
            <th></th>\
          </tr>\
        </thead>');
      for (i = 0; i < data.stacktemplates.length; i++){
        var name = data.stacktemplates[i].name;
        var description = data.stacktemplates[i].description;
        var dataurl = data.stacktemplates[i].stackdata;
        var downloads = data.stacktemplates[i].downloads;
        var user = data.stacktemplates[i].user;
        var exstackurl = 'https://stacks.taisun.io/?stack=' + dataurl.replace('https://stacks.taisun.io/templates/','');
        $('#stackstable').append('\
          <tr height="130">\
            <td><a href="' + exstackurl + '" target="_blank">' + name + '</a></td>\
            <td>' + downloads + '</td>\
            <td><button type="button" data-toggle="modal" data-target="#modal" style="cursor:pointer;" class="btn btn-primary btn-xs configurestack" value="' + dataurl + '">Configure and Launch <i class="fa fa-rocket"></i></button></td>\
          </tr>');
      }
    }
    // Pagination logic show +2 and -2 pages at the bottom of the table
    $('#taisunstacks').append('<ul id="stackpages" class="pagination"></ul>');
    for (i = -2; i < 3; i++){
      var pagenumber = parseInt(data.page.page) + i;
      // If negative page number do not display 
      if ( pagenumber <= 0){
      }
      // If current page highlight current
      else if ( pagenumber == data.page.page){
        $('#stackpages').append('<li class="page-item active"><a class="page-link" onclick="stacksearch(' + pagenumber + ')">' + pagenumber + '</a></li>');
      }
      // If not current page
      else if (parseInt(data.page.num_pages) - pagenumber >= 0){
        $('#stackpages').append('<li class="page-item"><a class="page-link" onclick="stacksearch(' + pagenumber + ')">' + pagenumber + '</a></li>');
      }
    }
  }
});

// When stack search button is activated send string to server
function stacksearch(page){
  $('#taisunstacks').empty();
  // Set the content to a spinner to signify loading
  $('#taisunstacks').append('<i class="fas fa-spinner fa-pulse" style="font-size:36px"></i>');
  socket.emit('searchstacks', $('#stacksearch').val(), page);
}

// Stack destroy modal
function stackdestroymodal(){
  modalpurge();
  $('#modaltitle').append('Destroy Stack');
  $('#modalbody').show();
  $('#modalbody').append('\
  <div class="form-group row">\
  <label for="desktop-destroy" class="col-sm-2 control-label">Name</label>\
    <div class="col-sm-10">\
    <input type="text" class="form-control" id="stack-destroy" placeholder="Stack Name">\
    </div>\
  </div>\
  ').promise().done($('#modal').on('shown.bs.modal', function () {
      $('#stack-destroy').focus();
    }));
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>\
  <button type="button" class="btn btn-success" onclick="destroystack()" data-dismiss="modal">Destroy</button>\
  ');
}
// When the stack destroy form is submitted send the reqest to the server
function destroystack(){
  socket.emit('destroystack', $('#stack-destroy').val());
}
// When the configure button is clicked send the URL to the server and give the user a spinner
$('body').on('click', '.configurestack', function(){
  socket.emit('sendstackurl', $(this).attr("value"));
  modalpurge();
  $('#modaltitle').append('Pulling definition from ' + $(this).attr("value"));
  $('#modalloading').show();
});
// When the configuregeneric button is clicked send the container Image name to the server
$('body').on('click', '.configuregeneric', function(){
  socket.emit('sendimagename', $(this).attr("value"));
  modalpurge();
  $('#modaltitle').append('Generating Launch form for ' + $(this).attr("value"));
  $('#modalloading').show();
});

// When the server sends us the stack data render in the configure modal
socket.on('stackurlresults', function(data) {
  modalpurge();
  var name = data[0];
  var markdown = data[1];
  var url = data[3];
  var template = data[4];
  $('#modaltitle').empty();
  $('#modaltitle').append(name + ' <button type="button" class="btn" onclick="yamluploadmodal(\'template-store\')">Edit <i class="fa fa-edit"></i></button>');
  $('#modalbody').show();
  $('#modalbody').append(converter.makeHtml(markdown));
  $('#modalbody').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fa fa-pencil"></i>\
      Launch Options\
    </div>\
    <div class="card-body" id="stackform">\
    </div>\
  </div>').promise().done(formbuilder(data[2]));
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel <i class="far fa-times-circle"></i></button>\
  <button type="button" class="btn btn-success" id="createstack" value="' + url + '">Create<i class="fa fa-rocket"></i></button>\
  <div id="template-store" style="display: none;">\
  ');
  $('#template-store').val(template);
});
// Convert the body object we get from the server into a bootstrap form
function formbuilder(data){
  // Loop through the form elements and render based on type
  $(data).each(function(index,input) {
    var type = input.type;
    if (type == 'input'){
      if (input.value){
        $('#stackform').append('\
          <div class="form-group row">\
          <label class="col-sm-2 control-label">' + input.FormName + '</label>\
            <div class="col-sm-10">\
            <input type="text" data-validation="' + input.validation + '" data-error="' + input.errormessage + '" data-required="' + input.required + '" data-label="' + input.label + '" class="form-control stackinputdata" value="' + input.value + '" placeholder="' + input.placeholder + '">\
            </div>\
          </div>');
      }
      else {
        $('#stackform').append('\
          <div class="form-group row">\
          <label class="col-sm-2 control-label">' + input.FormName + '</label>\
            <div class="col-sm-10">\
            <input type="text" data-validation="' + input.validation + '" data-error="' + input.errormessage + '" data-required="' + input.required + '" data-label="' + input.label + '" class="form-control stackinputdata" placeholder="' + input.placeholder + '">\
            </div>\
          </div>');
      }
    }
    else if (type == 'select'){
      var options = '';
      var opts = input.options;
      $(opts).each(function(index,opt) {
          options += '<option value="' + opt + '">' + opt + '</option>';
      }).promise().done(function(){
          $('#stackform').append('\
          <div class="form-group row">\
            <label class="col-sm-2 control-label">' + input.FormName + '</label>\
              <div class="col-sm-10">\
              <select data-label="' + input.label + '" class="custom-select stackinputdata">' + 
                options +
              '</select>\
              </div>\
           </div>');
      });
    }
    else if (type == 'checkbox'){
      $('#stackform').append('\
        <div class="form-group row">\
        <label class="col-sm-2 control-label">' + input.FormName + '</label>\
          <div class="col-sm-10">\
          <input type="checkbox" value="false" data-label="' + input.label + '" class="form-check-input stackinputdata">\
          </div>\
        </div>');
    }
    else if (type == 'textarea'){
      if (input.value){
        $('#stackform').append('\
          <div class="form-group row">\
          <label class="col-sm-2 control-label">' + input.FormName + '</label>\
            <div class="col-sm-10">\
            <textarea data-validation="' + input.validation + '" data-error="' + input.errormessage + '" data-required="' + input.required + '" data-label="' + input.label + '" class="form-control stackinputdata" value="' + input.value + '" placeholder="' + input.placeholder + '" rows="3"></textarea>\
            </div>\
          </div>');
      }
      else {
        $('#stackform').append('\
          <div class="form-group row">\
          <label class="col-sm-2 control-label">' + input.FormName + '</label>\
            <div class="col-sm-10">\
            <textarea type="text" data-validation="' + input.validation + '" data-error="' + input.errormessage + '" data-required="' + input.required + '" data-label="' + input.label + '" class="form-control stackinputdata" placeholder="' + input.placeholder + '" rows="3"></textarea>\
            </div>\
          </div>');
      }
    }
    // If hidden return nothing
    else if (type == 'hidden'){
      $('#stackform').append('NA');
    }
    // if no matches do nothing for now
    else{
    }
  });
}
// Send the form data to the server
$('body').on('click', '#createstack', function(){
  var inputs = {};
  var error = 'false';
  var url = $("#createstack").val();
  var template = $("#template-store").val();
  $("#template-store").empty();
  // Create an object with all the inputs for nunchucks and hide any previous errors
  $(".stackinputdata").each(function() {
    var validation = $(this).data('validation');
    var errormessage = $(this).data('error');
    var required = $(this).data('required');
    var value = $(this).val();
    var label = $(this).data('label');
    if ($(this).is("textarea")) {
      var checkarray = value.split("\n");
      for (i in checkarray){
        validatedata($(this),validation,errormessage,required,checkarray[i],label);
      }
    }
    else if ($(this).is("input")){
      validatedata($(this),validation,errormessage,required,value,label)
    }
    function validatedata(field,validation,errormessage,required,value,label){
      // Validate input
      if (required == true){
        if(value.length == 0){
          field.val('');
          field.removeClass('is-valid');
          field.addClass('is-invalid');
          field.attr("placeholder", label + ' is required');
          error += 'bad';        
        }
        else{
          field.removeClass('is-invalid');
          field.addClass('is-valid');
        }
      }
      if (validation != 'undefined' && errormessage != 'undefined' && (required == true|| value.length != 0)){
        var regexp = new RegExp(validation);
        if(!regexp.test(value)){
          field.val('');
          field.removeClass('is-valid');
          field.addClass('is-invalid');
          field.attr("placeholder", field.data('error'));
          error += 'bad';
        }
        else{
          field.removeClass('is-invalid');
          field.addClass('is-valid');
        }
      }
    }
    // Add to object based on input
    if ($(this).is(':checked') == true ) {
      inputs[label] = 'true';
    }
    else if ($(this).is("textarea") ) {
      var value = $(this).val();
      if (value != '') {
        inputs[label] = value.split("\n");
      }
    }
    else {
      var value = $(this).val();
      if (value != '') {
        inputs[label] = value;
      }
    }
  }).promise().then(function(){
      if (error == 'false'){
      socket.emit('launchstack',{"stackurl":url,"inputs":inputs,"template":template});
      modalpurge();
      $('#modalloading').show();
      $('#modaltitle').append('Launching ' + url);
      $('#modalconsole').show();
      $('#modalconsole').height('60vh');
    }
  });
});



// Show console output
socket.on('sendconsoleout', function(data) {
  // If this data has a docker guid in front of it then assign it to a div for updating
  if (data.split(':')[0].length == 12){
    var uuid = data.split(':')[0].toString();
    // If div allready exists then just update it
    if ($('#' + uuid).length) {
      $('#' + uuid).empty();
      $('#' + uuid).append(data);
    }
    // Div does not exist create it and put the data in it
    else{
      $('#modalconsole').append('<div id="' + uuid + '">' + data + '</div>');
    }
  }
  // If this data is in the compose pull format create a div for updating
  else if (data.split('...')[0].toString().includes('Pulling')){
    var pullid = data.split('...')[0].toString().replace(/\s/g,'');
    // If div allready exists then just update it
    if ($('#' + pullid).length) {
      $('#' + pullid).empty();
      $('#' + pullid).append(data);
    }
    // Div does not exist create it and put the data in it
    else{
      $('#modalconsole').append('<div id="' + pullid + '">' + data + '</div>');
    }
  }
  else{
    $('#modalconsole').append('<div>' + data + '</div>');
  }
  // Scroll to the bottom of the console output
  var toscroll = $("#modalconsole").get(0);
  toscroll.scrollTop = toscroll.scrollHeight;
});
// On console finish remove spinner and show close
socket.on('sendconsoleoutdone', function(data) {
  $('#modalloading').hide();
  $('#modalbody').show();
  $('#modalbody').append('<div><i class="fa fa-check"></i> ' + data + '</div>');
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-success" data-dismiss="modal">Close <i class="fa fa-check"></i></button>\
  ');
  // Scroll to the bottom of the console output
  var toscroll = $("#modalconsole").get(0);
  toscroll.scrollTop = toscroll.scrollHeight;
});

// Upload Yaml Modal
function yamluploadmodal(stackdata){
  var template = '';
  if (stackdata){
    var template = $('#' + stackdata).val();
  }
  modalpurge();
  $('#modaltitle').append('Custom YAML');
  $('#modalbody').show();
  $('#modalbody').append('\
    <p>Please see documentation <a href="https://github.com/Taisun-Docker/taisun/wiki/Templates" target="_blank">here</a> for writing Stack Templates</p>\
    <div id="editor" style="height: 500px; width: 100%"></div>\
  ');
  // Ace editor
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/chrome");
  editor.session.setMode("ace/mode/yaml");
  editor.session.setOptions({
      tabSize: 2
  });
  editor.setValue(template, -1);
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>\
  <button type="button" class="btn btn-success" onclick="uploadyaml()">Upload</button>\
  ');
}
// Upload Private Modal
function privateuploadmodal(){
  modalpurge();
  $('#modaltitle').append('Private Stacks');
  $('#modalbody').show();
  $('#modalbody').append('\
    <p>This process will take the template below, encrypt it, upload it to DockerHub, and give you a link you can use to launch this stack from any installation of Taisun.</p>\
    <p>You will need a DockerHub account to push these but not to consume them, format is USER/REPO:TAG. The endpoints will be automatically generated, no need to use existing ones.</p>\
    <form>\
      <div class="form-group row">\
        <label for="dockeruser" class="col-sm-2 col-form-label">DockerHub User</label>\
        <div class="col-sm-10">\
          <input type="text" class="form-control" id="dockeruser" placeholder="Docker Username">\
        </div>\
      </div>\
      <div class="form-group row">\
        <label for="dockerpass" class="col-sm-2 col-form-label">DockerHub Password</label>\
        <div class="col-sm-10">\
          <input type="password" class="form-control" id="dockerpass" placeholder="Password">\
        </div>\
      </div>\
      <div class="form-group row">\
        <label for="repo" class="col-sm-2 col-form-label">DockerHub Repo</label>\
        <div class="col-sm-10">\
          <input type="text" class="form-control" id="repo" placeholder="Repo to use IE taisun-templates">\
        </div>\
      </div>\
      <div class="form-group row">\
        <label for="tag" class="col-sm-2 col-form-label">DockerHub Tag</label>\
        <div class="col-sm-10">\
          <input type="text" class="form-control" id="tag" placeholder="Tag to use IE stackname">\
        </div>\
      </div>\
    </form>\
    <div id="editor" style="height: 500px; width: 100%"></div>\
  ');
  // Ace editor
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/chrome");
  editor.session.setMode("ace/mode/yaml");
  editor.session.setOptions({
      tabSize: 2
  });  
  $('#modalfooter').show();
  $('#modalfooter').append('\
  <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>\
  <button type="button" class="btn btn-success" onclick="pushstack()">Upload</button>\
  ');
}
// Send custom yaml to application
function uploadyaml(){
  var editor = ace.edit("editor");
  var code = editor.getValue();
  modalpurge()
  $('#modalloading').show();
  socket.emit('sendyaml',code);
}
// pushstack
function pushstack(){
  var editor = ace.edit("editor");
  var code = btoa(editor.getValue());
  $('#modalloading').show();
  var dockeruser = $("#dockeruser").val();
  var dockerpass = $("#dockerpass").val();
  var repo = $("#repo").val();
  var tag = $("#tag").val();
  var full = dockeruser + '/' + repo + ':' + tag;
  var data = [full,code,dockeruser,dockerpass];
  modalpurge();
  socket.emit('buildencrypto',data);
}

//// Render the remote access pages ////
function renderremote(){
  $('.nav-item').removeClass('active');
  $('#Remotenav').addClass('active');
  $('#pagecontent').empty();
  $('#pageheader').empty();  
  socket.emit('checkremote');
}
// Render the page based on the response from the server
socket.on('renderremote', function(data){
  if (data == 'no'){
    renderremotestart();
  }
  else {
    rendergateway(data);
  }
});

// Start page for remote access
function renderremotestart() {
  $('#pagecontent').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fa fa-sitemap"></i>\
      Remote access quickstart\
    </div>\
    <div class="card-body">\
      <center>\
        <h2>You will need a DNS endpoint that points to your IP to continue, login at <a href="https://www.taisun.io" target="_blank">Taisun.io</a> and click on Taisun DynDNS</h2>\
        <br>\
        <button type="button" class="btn btn-lg btn-primary configurestack" data-toggle="modal" data-target="#modal" value="http://localhost:3000/public/taisuntemplates/taisungateway.yml">I have an Endpoint</button>\
      </center>\
    </div>\
  </div>\
  ');
}
// Gateway management page
function rendergateway(container) {
  $('#pageheader').append('\
    <div class="row">\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white stackrestartbutton" style="cursor:pointer;" value="' + container.Config.Labels.stackname + '">\
          <div class="card text-white bg-info o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="fas fa-fw fa-sync"></i>\
              </div>\
              <div class="mr-5">\
                Restart Gateway\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white stackupgradebutton" style="cursor:pointer;" value="' + container.Config.Labels.stackname + '">\
          <div class="card text-white bg-info o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="fa fa-fw fa-arrow-up"></i>\
              </div>\
              <div class="mr-5">\
                Upgrade Gateway\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white containerlogsbutton" style="cursor:pointer;" value="' + container.Id + '">\
          <div class="card text-white bg-info o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="fa fa-fw fa-terminal"></i>\
              </div>\
              <div class="mr-5">\
                View logs\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white destroycontainer" style="cursor:pointer;" value="taisun_gateway">\
          <div class="card text-white bg-danger o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="fa fa-fw fa-minus-circle"></i>\
              </div>\
              <div class="mr-5">\
                Destroy Gateway\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
    </div>\
  ');
  $('#pagecontent').append('\
  <div class="card mb-3">\
    <div class="card-header">\
      <i class="fa fa-sitemap"></i>\
      Taisun Proxy\
    </div>\
    <div style="overflow-x:auto" class="card-body">\
        <div><p> Your server can be accessed remotely at <a href="https://www.taisun.io" target="_blank">Taisun.io</a></p></div>\
        <div><button type="button" class="btn btn-sm btn-secondary checkremotebutton" value="">Check Remote Access</button><div id="remotestatus"></div></div>\
        <br>\
        <div>\
          <table id="gatewaytable" class="table table-hover">\
            <tr><td>State</td><td>' + container.State.Status + '</td></tr>\
          </table>\
        </div>\
    </div>\
    </div>\
      <div class="card mb-3">\
        <div class="card-header">\
          <i class="fas fa-ellipsis-h"></i>\
          Deployed Public Gateways <button type="button" data-toggle="modal" data-target="#modal" onclick="stackdestroymodal()" style="cursor:pointer;" class="btn btn-sm btn-danger float-right" >Remove <i class="fas fa-minus-circle"></i></button> <button type="button " style="cursor:pointer;margin-right:10px;" data-toggle="modal" data-target="#modal" class="btn btn-sm btn-success configurestack float-right" value="http://localhost:3000/public/taisuntemplates/taisunportforward.yml">Add <i class="fas fa-plus"></i></button>\
        </div>\
        <div class="card-body" style="overflow-x:auto">\
          <div class="table-responsive">\
            <table id="gateways" class="table table-hover" width="100%" cellspacing="0">\
              <thead>\
                <tr>\
                  <th>Name</th>\
                  <th>Public URL</th>\
                  <th>Backend</th>\
                </tr>\
              </thead>\
            </table>\
          </div>\
        </div>\
      </div>\
  ').promise().done(function(){
    var envarr = container.Config.Env;
    for (i = 0; i < envarr.length; i++){
      var key = envarr[i].split('=')[0];
      var value = envarr[i].split('=')[1];
      if (key == 'DNSKEY' || key == 'SERVERIP' || key == 'EMAIL' ){
        $('#gatewaytable').append('<tr><td>' + key + '</td><td>' + value + '</td></tr>');
      }
      if (key == 'SERVERIP'){
        $('.checkremotebutton').attr('value', value);
        $('#pagecontent').append('<input type="hidden" id="serverip" value="' + value + '" />');
      }
    }
  });
}

// RDP/VNC Page
function renderrdpvnc(){
  $('.nav-item').removeClass('active');
  $('#RDPVNCnav').addClass('active');
  $('#pageheader').empty();
  $('#pagecontent').empty();
  socket.emit('checkguac', 'renderrdpvnc');
}
socket.on('renderrdpvnc', function(response){
  if (response == "no"){
    $('#pagecontent').append('\
    <div class="card mb-3">\
      <div class="card-header">\
        <i class="fa fa-laptop"></i>\
         Endpoints\
      </div>\
      <div class="card-body">\
        <center>\
          <h2>To run VNC/RDP you must first launch Guacamole Server</h2>\
          <br>\
          <button type="button" class="btn btn-lg btn-primary guacdlaunch" data-toggle="modal" data-target="#modal">Launch Now</button>\
        </center>\
      </div>\
    </div>\
    ');
  }
  else if (response == "yes"){
    $('#pageheader').append('\
    <div class="row">\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white configurestack" style="cursor:pointer;" value="http://localhost:3000/public/taisuntemplates/taisunrdpvnc.yml">\
          <div class="card text-white bg-success o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="far fa-fw fa-plus-square"></i>\
              </div>\
              <div class="mr-5">\
                Add RDP/VNC Endpoint\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white" style="cursor:pointer;" onclick="stackdestroymodal()">\
          <div class="card text-white bg-danger o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="fa fa-fw fa-minus-circle"></i>\
              </div>\
              <div class="mr-5">\
                Remove RDP/VNC Endpoint\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
      </div>\
      <div class="col-xl-3 col-sm-6 mb-3">\
        <a data-toggle="modal" data-target="#modal" class="text-white" style="cursor:pointer;" onclick="guacstatusmodal()">\
          <div class="card text-white bg-success o-hidden h-60">\
            <div class="card-body">\
              <div class="card-body-icon">\
                <i class="far fa-fw fa-thumbs-up"></i>\
              </div>\
              <div class="mr-5">\
                GuacD\
              </div>\
            </div>\
          </a>\
        </div>\
      </div>\
    </div>\
    ');
    $('#pagecontent').empty();
    $('#pagecontent').append('\
    <div class="card mb-3">\
      <div class="card-header">\
        <i class="fa fa-laptop"></i>\
        Endpoints\
      </div>\
      <div style="overflow-x:auto" class="card-body" id="rdpvncstacks">\
      <center><i class="fas fa-spinner fa-pulse" style="font-size:36px"></i><br><h2>Fetching endpoints from Taisun</h2></center>\
      </div>\
    </div>\
    ');
    socket.emit('getrdpvnc', '1');
  }
});
// When the server sends us the running stacks render
socket.on('updaterdbvnc', function(containers) {
  updaterdpvnc(containers);
});
function updaterdpvnc(containers){
  $('#rdpvncstacks').empty();
  $('#rdpvncstacks').append('\
  <table style="width:100%" id="rdpvncresults" class="table table-hover">\
    <thead>\
      <tr>\
        <th>Name</th>\
        <th>Launch</th>\
        <th>Type</th>\
        <th>Host</th>\
        <th>User</th>\
      </tr>\
    </thead>\
  </table>\
  ');
  var rdpvnccontainers = [];
  $(containers).each(function(index,container){
    var labels = container.Labels;
    if (labels.stacktype){
      var stacktype = labels.stacktype;
      if (stacktype == 'rdpvnc'){
        rdpvnccontainers.push(container);
      }
    }
  }).promise().done(function(){
    // No RDP/VNC containers found
    if (rdpvnccontainers.length == 0){
      $('#rdpvncstacks').empty();
      $('#rdpvncstacks').append('<center><h2>No Endpoints found</h2><br><button type="button" data-toggle="modal" data-target="#modal" class="btn btn-primary configurestack" style="cursor:pointer;" value="http://localhost:3000/public/taisuntemplates/taisunrdpvnc.yml" >Add Endpoint <i class="fa fa-plus-square"></i></button></center>');
    }
    // Found some RDP/VNC containers
    else{
      // Loop through the stacks to render them
      $("#rdpvncresults").dataTable().fnDestroy();
      var rdpvnctable = $('#rdpvncresults').DataTable( {} );
      rdpvnctable.clear();
      //Loop through the containers
      $(rdpvnccontainers).each(function(index, container) {
        var labels = container.Labels;
        var type = labels.remote_type;
        rdpvnctable.row.add(
          [
            labels.stackname,
            '<a href="/' + type + '/' + container.Id + '" target="_blank" class="btn btn-sm btn-primary">Launch</a>',
            type,
            labels.host + ':' + labels.port,
            labels.user
          ]
        );
      }).promise().done(rdpvnctable.draw());
    }
  });
}


// Whenever the stack list is updated rebuild the displayed table for port forwarders
socket.on('updategateway', function(containers) {
  updategateway(containers);
});
function updategateway(containers){
  // Loop through the Gateways deployed to show them on the remote access page
  $("#gateways").dataTable().fnDestroy();
  var gatewaytable = $('#gateways').DataTable( {} );
  gatewaytable.clear();
  //Loop through the containers to build the containers table
  $(containers).each(function(index,container){
    var labels = container.Labels;
    if (labels.stacktype){
      if (labels.stacktype == 'portforward'){
        var ext_url = 'https://' + labels.frontend + '.' + $('#serverip').val() + ':4443';
        gatewaytable.row.add( 
          [labels.stackname,
          '<a href="' + ext_url + '" target="_blank">' + ext_url + '</a>',
          '<a href="' + labels.backend + '" target="_blank">' + labels.backend + '</a>'] 
        );
      }
    }
  }).promise().done(function(){
    gatewaytable.draw();
  });
}

// When destroy gateway is clicked remove it from the system
$('body').on('click', '.destroycontainer', function(){
  name = $(this).attr("value");
  destroycontainer(name);
});

// When remote button is clicked ask the server to check
$('body').on('click', '.checkremotebutton', function(){
  socket.emit('checkremoteaccess', $(this).attr("value"));
  $('#remotestatus').empty();
  $('#remotestatus').append('<i class="fas fa-spinner fa-pulse" style="font-size:36px"></i>');
});
// When server tells us the response populate the status div
socket.on('sendremotestatus', function(data){
  if (data.result == 'open'){
    $('#remotestatus').empty();
    $('#remotestatus').append('<i style="color:green;" class="fa fa-check"></i> ' + data.message);
  }
  else {
    $('#remotestatus').empty();
    $('#remotestatus').append('<i style="color:red;" class="fas fa-times"></i> ' + data.message);
  }
});

// Taisun Update Modal
$('body').on('click', '.updatetaisun', function(){
  modalpurge();
  $('#modaltitle').append('Taisun Update');
  $('#modalloading').show();
  socket.emit('getversion');
});
socket.on('sendversion', function(version){
  $('#modalloading').hide();
  $('#modalbody').show();
  $('#modalbody').append('<center>\
          <h2>This will replace the Taisun Container if a new version is available</h2>\
          <br>\
          <h2>Current Version: <a href="https://github.com/Taisun-Docker/taisun/releases/' + version + '" target="_blank">' + version + '</a></h2>\
          <br>\
          <button type="button" class="btn btn-lg btn-primary taisunupdate" style="cursor:pointer;">Update</button>\
        </center>\
        ');
});
// Taisun Update Modal
$('body').on('click', '.taisunupdate', function(){
  $('#modalbody').empty();
  $('#modalbody').append('Running upgrade in the background using an external container, no further output will be displayed and the page will refresh in 20 seconds');
  $('#modalloading').show();
  setTimeout(location.reload.bind(location), 20000);
  socket.emit('upgradetaisun');
});

//// Page updating ////
// When the server sends data call update funtions with it based on the dom elements present
socket.on('updatestacks', function(containers) {
  if ($('#vdistacks').length > 0) {
    updatevdi(containers);
  }
  if ($('#devstacks').length > 0) {
    updatedev(containers);
  }
  if ($('#localstacks').length > 0) {
    updatelocalstacks(containers);
  }
  if ($('#gateways').length > 0) {
    updategateway(containers);
  }
  if ($('#termstacks').length > 0) {
    updateterm(containers);
  }
  if ($('#rdpvncstacks').length > 0) {
    updaterdpvnc(containers);
  }
});

// Purge the modal of data
function modalpurge(){
  $('#modaltitle').empty();
  $('#modalbody').empty();
  $('#modalconsole').empty();
  $('#modalfooter').empty();
  $('#modalloading').hide();
  $('#modalbody').hide();
  $('#modalconsole').hide();
  $('#modalfooter').hide();
}
//// Grabbed from the admin template ////
// Configure tooltips for collapsed side navigation
$('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
  template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
});
// Toggle the side navigation
$("#sidenavToggler").click(function(e) {
  e.preventDefault();
  $("body").toggleClass("sidenav-toggled");
  $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
  $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
});
// Force the toggled class to be removed when a collapsible nav link is clicked
$(".navbar-sidenav .nav-link-collapse").click(function(e) {
  e.preventDefault();
  $("body").removeClass("sidenav-toggled");
});
// Prevent the content wrapper from scrolling when the fixed side navigation hovered over
$('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
  var e0 = e.originalEvent,
    delta = e0.wheelDelta || -e0.detail;
  this.scrollTop += (delta < 0 ? 1 : -1) * 30;
  e.preventDefault();
});
// Scroll to top button appear
$(document).scroll(function() {
  var scrollDistance = $(this).scrollTop();
  if (scrollDistance > 100) {
    $('.scroll-to-top').fadeIn();
  } else {
    $('.scroll-to-top').fadeOut();
  }
});
// Smooth scrolling using jQuery easing
$(document).on('click', 'a.scroll-to-top', function(event) {
  var $anchor = $(this);
  $('html, body').stop().animate({
    scrollTop: ($($anchor.attr('href')).offset().top)
  }, 1000, 'easeInOutExpo');
  event.preventDefault();
});
