
/* =========================================================================
 *
 *  editor__html.js
 *  Edit/add a thumbnail image.
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import logger from 'bragi-browser';

// Internal Dependencies
// ------------------------------------
import Actions from '../actions/actions.js';
import {IconLoader} from './icons.js';

// ========================================================================
//
// Functionality
// ========================================================================
var EditorPNG = React.createClass({

  componentWillMount: function componentWillMount(nextProps) {
    var gist = this.props.gist;
    // We are checking if this gist is already owned by the authenticated user.
    // The only case we want to support the adding/editing of a thumbnail is if the gist is already created/owned by the user
    if(gist && gist.id && gist.owner && this.props.user && gist.owner.id === this.props.user.id) {
      this.setState({ canEdit: true })
    } else {
      this.setState({ canEdit: false})
    }
  },
  componentDidMount: function componentDidMount(){
    logger.log('components/EditorTXT:component:componentDidMount', 'called');
  },
  componentDidUpdate: function componentDidUpdate(){
    logger.log('components/EditorTXT:component:componentDidUpdate', 'called');
  },

  selectFile: function selectFile(evt) {
    var gist = this.props.gist;
    var files = evt.target.files;
    var file = files[0];
    // TODO error handling
    if(!file) return;
    if(file.size > 10000000) {
      Actions.setModal(`ERROR: ${file.name} is too big, ${file.size} > 10mb`)
      console.log("ERROR", "file too big!", file.size, " > 10mb")
      return;
    }
    if(file.type.indexOf("image/") === 0) {
      var reader = new FileReader();
      var that = this;
      reader.onload = (function(data) {
        var editor = document.getElementById('editor__png')
        editor.src = data.target.result;

        var imgCV = document.createElement('canvas');
        imgCV.width = editor.width;
        imgCV.height = editor.height;
        var imgCtx = imgCV.getContext('2d');
        imgCtx.drawImage(editor, 0, 0);
        var scale = 230 / editor.width;
        if(scale == 1) {
          var resCV = document.createElement('canvas');
          resCV.width = editor.width;
          resCV.height = editor.height;
          var resCtx = resCV.getContext('2d');
          resCtx.imageSmoothingEnabled = false;
          resCtx.webkitImageSmoothingEnabled = false;
          resCtx.mozImageSmoothingEnabled = false;
          resCtx.drawImage(editor, 0, 0);
          that.thumb = resCV;
        } else {
          that.thumb = downScaleCanvas(imgCV, scale);
        }
        d3.select("#preview").selectAll("canvas").remove()
        d3.select("#preview").node().appendChild(that.thumb)
        console.log("thumb", that.thumb)

        that.setState({canSave: true})
      });
      reader.readAsDataURL(file);

    } else {
      // TODO: error modal
      Actions.setModal(`ERROR: ${file.name} is Not an image`)
      console.log("ERROR", "not an image!", file)
    }
    
  },

  handleSave: function handleSave() {
    var gist = this.props.gist;
    var editor = document.getElementById('editor__png')
    if(this.state.canSave) {
      Actions.setSaveFork("saving")
      Actions.saveThumbnail({image: this.thumb.toDataURL(), gistId: gist.id});
      //this.setState({saving: true})
    } else {
      Actions.setModal('Please select a file')
    }
  },

  render: function render() {
    var gist = this.props.gist;
    var text = gist.files[this.props.active].content;
    var png = gist.files["thumbnail.png"];
    var img;
    if(png && png.raw_url){ 
      img = ( <img id='editor__png' src={png.raw_url}></img> );
    } else {
      // TODO: add placeholder for thumbnail
      img = ( <img id='editor__png' src=""></img> );
    }

    var save
    var loading = (
      <div id='nav__loading'>
        <IconLoader></IconLoader>
      </div>
    )
    if(this.state.saving) {
      save = loading
    } else {
      save = (
        <div onClick={this.handleSave} id="thumbnail__save">Save</div>
      )
    }


    var edit = (
      <div id="block__code-thumbnail-edit">
        <input onChange={this.selectFile} type="file" id="editor__png-input" name="files[]"/>
        {save}
      </div>
    )
    if(!this.state.canEdit) edit = "";

    return (
      <div id='block__code-index'>
        <div id="preview"></div>
        {img}
        <br/>
        {edit}
        
      </div>
    )
  }

})

export default EditorPNG;


//http://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
//http://jsfiddle.net/gamealchemist/r6aVp/
function downScaleCanvas(cv, scale) {
    if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
    var sqScale = scale * scale; // square scale = area of source pixel within target
    var sw = cv.width; // source image width
    var sh = cv.height; // source image height
    var tw = Math.floor(sw * scale); // target image width
    var th = Math.floor(sh * scale); // target image height
    var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
    var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
    var tX = 0, tY = 0; // rounded tx, ty
    var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
    // weight is weight of current source point within target.
    // next weight is weight of current source point within next target's point.
    var crossX = false; // does scaled px cross its current px right border ?
    var crossY = false; // does scaled px cross its current px bottom border ?
    var sBuffer = cv.getContext('2d').
    getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
    var tBuffer = new Float32Array(3 * tw * th); // target buffer Float32 rgb
    var sR = 0, sG = 0,  sB = 0; // source's current point r,g,b
    /* untested !
    var sA = 0;  //source alpha  */    

    for (sy = 0; sy < sh; sy++) {
        ty = sy * scale; // y src position within target
        tY = 0 | ty;     // rounded : target pixel's y
        yIndex = 3 * tY * tw;  // line index within target array
        crossY = (tY != (0 | ty + scale)); 
        if (crossY) { // if pixel is crossing botton target pixel
            wy = (tY + 1 - ty); // weight of point within target pixel
            nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
        }
        for (sx = 0; sx < sw; sx++, sIndex += 4) {
            tx = sx * scale; // x src position within target
            tX = 0 |  tx;    // rounded : target pixel's x
            tIndex = yIndex + tX * 3; // target pixel index within target array
            crossX = (tX != (0 | tx + scale));
            if (crossX) { // if pixel is crossing target pixel's right
                wx = (tX + 1 - tx); // weight of point within target pixel
                nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
            }
            sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
            sG = sBuffer[sIndex + 1];
            sB = sBuffer[sIndex + 2];

            /* !! untested : handling alpha !!
               sA = sBuffer[sIndex + 3];
               if (!sA) continue;
               if (sA != 0xFF) {
                   sR = (sR * sA) >> 8;  // or use /256 instead ??
                   sG = (sG * sA) >> 8;
                   sB = (sB * sA) >> 8;
               }
            */
            if (!crossX && !crossY) { // pixel does not cross
                // just add components weighted by squared scale.
                tBuffer[tIndex    ] += sR * sqScale;
                tBuffer[tIndex + 1] += sG * sqScale;
                tBuffer[tIndex + 2] += sB * sqScale;
            } else if (crossX && !crossY) { // cross on X only
                w = wx * scale;
                // add weighted component for current px
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tX+1) px                
                nw = nwx * scale
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
            } else if (crossY && !crossX) { // cross on Y only
                w = wy * scale;
                // add weighted component for current px
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // add weighted component for next (tY+1) px                
                nw = nwy * scale
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
            } else { // crosses both x and y : four target points involved
                // add weighted component for current px
                w = wx * wy;
                tBuffer[tIndex    ] += sR * w;
                tBuffer[tIndex + 1] += sG * w;
                tBuffer[tIndex + 2] += sB * w;
                // for tX + 1; tY px
                nw = nwx * wy;
                tBuffer[tIndex + 3] += sR * nw;
                tBuffer[tIndex + 4] += sG * nw;
                tBuffer[tIndex + 5] += sB * nw;
                // for tX ; tY + 1 px
                nw = wx * nwy;
                tBuffer[tIndex + 3 * tw    ] += sR * nw;
                tBuffer[tIndex + 3 * tw + 1] += sG * nw;
                tBuffer[tIndex + 3 * tw + 2] += sB * nw;
                // for tX + 1 ; tY +1 px
                nw = nwx * nwy;
                tBuffer[tIndex + 3 * tw + 3] += sR * nw;
                tBuffer[tIndex + 3 * tw + 4] += sG * nw;
                tBuffer[tIndex + 3 * tw + 5] += sB * nw;
            }
        } // end for sx 
    } // end for sy

    // create result canvas
    var resCV = document.createElement('canvas');
    resCV.width = tw;
    resCV.height = th;
    var resCtx = resCV.getContext('2d');
    resCtx.imageSmoothingEnabled = false;
    resCtx.webkitImageSmoothingEnabled = false;
    resCtx.mozImageSmoothingEnabled = false;
    var imgRes = resCtx.getImageData(0, 0, tw, th);
    var tByteBuffer = imgRes.data;
    // convert float32 array into a UInt8Clamped Array
    var pxIndex = 0; //  
    for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
        tByteBuffer[tIndex] = Math.ceil(tBuffer[sIndex]);
        tByteBuffer[tIndex + 1] = Math.ceil(tBuffer[sIndex + 1]);
        tByteBuffer[tIndex + 2] = Math.ceil(tBuffer[sIndex + 2]);
        tByteBuffer[tIndex + 3] = 255;
    }
    // writing result to canvas.
    resCtx.putImageData(imgRes, 0, 0);
    return resCV;
}