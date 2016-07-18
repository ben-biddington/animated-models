

function getAnimationFrames() {

  var frames = {}

  var modelList = Object.keys(models).sort(alphanum)

  for (var i = 0; i < modelList.length; i++) {

    var name = modelList[i]
    var model = models[name]

    if (model.errors.length == 0 && model.contextErrors.length == 0) {

      var textureNames = Object.keys(model.data.textures)
      var modeltextures = {}
      var rawTextureList = []

      for (var j = 0; j < textureNames.length; j++) {

        var textureReference = textureNames[j]
        var tmp = model.data.textures[textureReference].split('/')
        var texturename = tmp[tmp.length-1]

        var texture = textures[texturename + '.png']

        if (texture.data.width != texture.data.height) {
          var mcmetaname = texturename + '.png.mcmeta'
          var mcmeta = mcmetas[mcmetaname]
          rawTextureList.push({name: texturename, texture: texture.raw, mcmeta: mcmeta.raw})
          modeltextures[texturename] = {texture: texture.data, mcmeta: mcmeta.data}
        } else {
          rawTextureList.push({name: texturename, texture: texture.raw})
          modeltextures[texturename] = {texture: texture.data}
        }

      }

      var displayName = name.split('.json')[0]

      frames[displayName] = {
        model: model.data,
        textures: modeltextures,
        threeModel: new JsonModel(displayName, model.raw, rawTextureList)
      }

    }

  }

  return frames

}



function displayAnimationFrames() {

  var frameNames = Object.keys(animationFrames)
  var cont = $('#frames-container')
  cont.html('')

  viewer.removeAll()

  for (var i = 0; i < frameNames.length; i++) {

    var name = frameNames[i]
    var frame = animationFrames[name]

    var html = '<div class="frame-element" data-name="' + name + '"><div class="frame-preview noselect"><svg><use xlink:href="#svg-file"/></svg></div><div class="frame-name">' + name + '</div></div>'

    var frameElement = $(html)
    cont.append(frameElement)

    viewer.load(frame.threeModel)
    viewer.hide(name)

    ;(function(name, frame, frameElement) {

      frameElement.click(function(event) {
        event.stopPropagation()
        $('.frame-element.selected').removeClass('selected')
        frameElement.addClass('selected')
        viewer.hideAll()
        viewer.show(name)
        activeModel = name
        allFramesSelected = false
      })


    })(name, frame, frameElement)

  }


}
