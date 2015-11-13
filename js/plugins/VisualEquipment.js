//=============================================================================
// VisualEquipment.js
// Version: 1.0
//=============================================================================

var Imported = Imported || {};
Imported.RexalVisualEquipment = true;

var Rexal = Rexal || {};
Rexal.VE = Rexal.VE || {};
/*:
 * @plugindesc Version: 1.0 -
 * Visualize your Equipment!
 * @author Rexal
 *
 
  * @param Debug
 * @desc Log to the console?
 * This sends a LOT of logs. Use only if you're having issues.
 * @default false

 * @param One Sprite Per Layer
 * @desc Have only one sprite per layer?
 * performance but makes it a lot more difficult to use.
 * @default false

 
  * @help

 --------------------------------------------------------------------------------
 Parameters
 ================================================================================
Debug - Will write to the console if true. THIS SENDS A WHOLE LOT OF LOGS 
WHICH CAN LAG THE GAME, SO ONLY TURN THIS ON IF YOU ARE HAVING ISSUES

One Sprite Per Layer - By default, you can have an infinite amount of parts 
per layer. However, making this parameter true will cause only one sprite to 
show per defined layer, which saves performance. This can be rather difficult 
to use however, so I recommend using this only if you really need it.
 --------------------------------------------------------------------------------
 Notetags
 ================================================================================
 [VE Actor]


Using this tag will make the actor's sprites(and any instance of them) 
invisible. This is so you can create an actor entirely from parts.

This is, of course, Actor's notes only.



VE Image name,layer,hue,saturation,value


This be used for Actors, Weapons, and Armor. If used for actors, they 
will always have those parts no matter what...unless you use the One 
Sprite Per Layer parameter, of course.


First, ensure that you have a folder named parts, and inside that 
folder are three others named character,face, and battler.

When you use this tag, the plugin will search the folder relevant to 
the situation for the sprite with the name you've specified, For 
example, if the actor's face pops up, it'll look in the "face" folder.

The layer tells the plugin what order the part should be created in. 
It goes lowest to highest, and by default is 0.

hue is the color of the part.

saturation is how colorful the part is. 255 is completely colorless.

value is how bright the part is. 0 is the normal value, -255 is 
black, and 255 is white.


note: everything but image can be set to an eval formula. Keep in 
mind though that right now it only sets these values the moment 
the parts are created.

 --------------------------------------------------------------------------------
 Version Log
 ================================================================================
 1.0
 
 */
  //-----------------------------------------------------------------------------
 // Parameters
//=============================================================================
  
 Rexal.VE.Parameters = PluginManager.parameters('VisualEquipment');
 Rexal.VE.OnePerLayer = eval(String(Rexal.VE.Parameters['One Sprite Per Layer']));
  Rexal.VE.Debug = eval(String(Rexal.VE.Parameters['Debug']));
  //-----------------------------------------------------------------------------
 // ImageManager
//=============================================================================
 
 //TODO look into $gameMap.requestRefresh();
 
  ImageManager.loadCharacterPart = function(filename, hue) {
    return this.loadBitmap('img/parts/character/', filename, hue, false);
};

  ImageManager.loadBattlerPart = function(filename, hue) {
    return this.loadBitmap('img/parts/battler/', filename, hue, false);
};

ImageManager.loadFacePart = function(filename, hue) {
	
    return this.loadBitmap('img/parts/face/', filename, hue, true);
};

  //-----------------------------------------------------------------------------
 // Sprite
//=============================================================================

Sprite.prototype.createCharacter = function(actor){
	this.dontdoit = true;
	var sprites = [];
	 if(!actor) return;
	
var act = $dataActors[actor.actorId()];
Rexal.VE.processPartNoteTag(act);
this._visual = act._visual;
if(act.sprites)sprites = this.combineParts(sprites,act.sprites); else return;

var length = actor.equips().length;

if(Rexal.VE.Debug)console.debug('actor = ' + actor.name());
if(Rexal.VE.Debug)console.debug('amount of equips = ' + length);

	for(var i = 0; i<length; i++){

	var equip = actor.equips()[i];
		if(equip){
		if(Rexal.VE.Debug)console.log('reading ' + equip.name +"...");
		Rexal.VE.processPartNoteTag(equip);

	if(equip.sprites)sprites = this.combineParts(sprites,equip.sprites);
	
	}
	   else if(Rexal.VE.Debug)console.warn('Not wearing any ' + $dataSystem.equipTypes[i+1] + ' equipment...');
   }
   
	if(sprites && actor){
		if(Rexal.VE.Debug)console.info('creating parts...')
		this.createParts(sprites);
	}
	
 
	 
}

Sprite.prototype.findHighestPart = function(array){
var layer = 0;

for(var i = 0; i<array.length; i++){
var n = parseInt(array[i].split(',')[1]);
if(n>layer) layer = n;
	}
	if(Rexal.VE.Debug)console.info(layer + ' is the highest layer');
	return layer;
};

Sprite.prototype.combineParts = function(array,array2){
var ar = array;
if(!ar)ar = [];
	for(var i = 0; i<array2.length; i++)
	{
		ar.push(array2[i]);
		if(Rexal.VE.Debug)console.info('added '+ array2[i]);
	}
	return ar;
};

Sprite.prototype.createParts = function(array,sprite){
var min = this.findLowestPart(array);
var max = this.findHighestPart(array)+1;
var newArray = [];

if(this._visual)sprite.bitmap.clear();

for(var i = min; i<max; i++)
{
	for(var s = 0; s<array.length; s++){
		var n = parseInt(array[s].split(',')[1]);
		var name = array[s].split(',')[0];
		var hue = eval(array[s].split(',')[2]);
		var saturation = eval(array[s].split(',')[3]);
		var value = eval(array[s].split(',')[4]);
		var hsv = [hue,saturation,value];
		if(Rexal.VE.Debug)console.log('Layer ' + i + ': '+'checking '+ name + '...');
		if(n == i){
			this.createPart(name,hsv);
			if(Rexal.VE.Debug)console.info(name + ' is layer ' + i);
			if(Rexal.VE.OnePerLayer)break;
		}
	
	}
}

};

Sprite.prototype.findLowestPart = function(array){
var layer = 0;

for(var i = 0; i<array.length; i++){
var n = parseInt(array[i].split(',')[1]);
if(n<layer) layer = n;
	}
	if(Rexal.VE.Debug)console.info(layer + ' is the lowest layer');
	return layer;
};

Sprite.prototype.HSV = function(sprite,hsv){
	var sat = hsv[1];
	var val = hsv[2];
	sprite.setColorTone([val, val, val, sat]);
};

Sprite.prototype.createPart = function(name,hsv,sprite) {
	if(Rexal.VE.Debug)console.log('creating ' + name + '...');
    sprite._part = name;
	sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
	sprite.innit(hsv);
	sprite._battlerName = this._battlerName;
	sprite.HSV();
   return sprite;
};

Sprite.prototype.innit = function(hsv){
	this._hsv = hsv;
}

  //-----------------------------------------------------------------------------
 // Sprite_Actor
//=============================================================================
 
Rexal.VE.saupdatebitmap = Sprite_Actor.prototype.updateBitmap;
Sprite_Actor.prototype.updateBitmap = function() {
    Rexal.VE.saupdatebitmap.call(this);
        	if(!this.dontdoit && this._actor)this.createCharacter();
};

Sprite_Actor.prototype.createCharacter = function() {
	var actor = Rexal.VE.findActorByBattleSprite(this._actor.battlerName());
	Sprite.prototype.createCharacter.call(this,actor);
};

Sprite_Actor.prototype.createParts = function(array){
	if(this._visual)this._mainSprite.opacity = 0;
	Sprite.prototype.createParts.call(this,array,this._mainSprite);
};

Sprite_Actor.prototype.createPart = function(name,hsv) {
    var sprite = new Sprite_PartBattle(this._actor);
		sprite._hsv = hsv;
	this.addChild(Sprite.prototype.createPart.call(this,name,hsv,sprite));
	
};

 //-----------------------------------------------------------------------------
// Sprite_Character
//=============================================================================

 Rexal.VE.scsetbit =  Sprite_Character.prototype.setCharacterBitmap;
 Sprite_Character.prototype.setCharacterBitmap = function() {
	Rexal.VE.scsetbit.call(this);
	if(!this.dontdoit)this.createCharacter();
};

Rexal.VE.SCupdate = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function(){
Rexal.VE.SCupdate.call(this);
if(this._visual)this.bitmap.clear();

}

 Sprite_Character.prototype.createCharacter = function() {
	if(Rexal.VE.Debug)console.debug('characterName = ' + this._character.characterName());if(Rexal.VE.Debug)console.debug('characterId = ' + this._character.characterIndex());

	var actor =  Rexal.VE.findActorBySprite(this._character.characterName(),this._character.characterIndex());
	
	
	Sprite.prototype.createCharacter.call(this,actor);
};

Sprite_Character.prototype.createParts = function(array){
	Sprite.prototype.createParts.call(this,array,this);
};

Sprite_Character.prototype.createPart = function(name,hsv) {
    var sprite = new Sprite_Part();
	this.addChild(Sprite.prototype.createPart.call(this,name,hsv,sprite));
};

  //-----------------------------------------------------------------------------
// Sprite_Part
//=============================================================================
 
function Sprite_Part() {
    this.initialize.apply(this, arguments);
}

Sprite_Part.prototype = Object.create(Sprite_Character.prototype);
Sprite_Part.prototype.constructor = Sprite_Part;
 
 Sprite_Part.prototype.initialize = function(character) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();

};

 Sprite_Part.prototype.setCharacterBitmap = function() {
	 this.HSV( this.bitmap,this._hsv);
	  this._isBigCharacter = true;
};
 
 Sprite_Part.prototype.HSV = function(){
	Sprite.prototype.HSV.call(this,this,this._hsv);
	this.bitmap = ImageManager.loadCharacterPart(this._part, this._hsv[0]);
};
 
Sprite_Part.prototype.update = function() {
	this.HSV();
		 	this.setCharacter(this.parent._character);
	    Sprite_Character.prototype.update.call(this);

	this._bushDepth = this.parent._bushDepth;
		this.x = 0; this.y = 0;
    this.updateBitmap();
    this.updateFrame();
    this.updateOther();
};

 //-----------------------------------------------------------------------------
// Sprite_PartBattle
//=============================================================================
 
function Sprite_PartBattle() {
    this.initialize.apply(this, arguments);
}

Sprite_PartBattle.prototype = Object.create(Sprite_Actor.prototype);
Sprite_PartBattle.prototype.constructor = Sprite_PartBattle;
 
Sprite_PartBattle.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
    this.moveToStartPosition();
};

Sprite_PartBattle.prototype.setBattler = function(battler) {
    Sprite_Actor.prototype.setBattler.call(this, battler);
};

Sprite_PartBattle.prototype.createShadowSprite = function() {
    this._shadowSprite = new Sprite();
};

 Sprite_PartBattle.prototype.innit = function(hsv) {

		 this.updateBitmap();
    if(Rexal.VE.Debug)console.warn('successfully created '+ this._part + '!');
	this.y = 0;
	this.x = 0;
	if(Rexal.VE.Debug)console.info(this._mainSprite.bitmap);

};

Sprite_PartBattle.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
	this._motion = this.parent._motion;
	this._pattern = this.parent._pattern;
	this.x = 0;
	this.y = 0;
	this._mainSprite.scale = this.parent._mainSprite.scale;
};

Sprite_PartBattle.prototype.setActorHome = function(index) {
    this.setHome(0,0);
};

Sprite_PartBattle.prototype.updateBitmap = function(hsv) {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._actor.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name; 
		this.HSV();
			
    }
};

 Sprite_PartBattle.prototype.HSV = function(){
	Sprite.prototype.HSV.call(this,this._mainSprite,this._hsv);
	this._mainSprite.bitmap = ImageManager.loadBattlerPart(this._part, this._hsv[0]);
};

 //-----------------------------------------------------------------------------
// Window_Base
//=============================================================================

Rexal.VE.drawMessageFace = Window_Message.prototype.drawMessageFace;
Window_Message.prototype.drawMessageFace = function() {
		this.removeParts();
    Rexal.VE.drawMessageFace.call(this);
};

//Rexal.VE.drawItemImage = Window_MenuStatus.prototype.drawItemImage;
Window_MenuStatus.prototype.drawAllItems = function() {
	this.removeParts();
	Window_Selectable.prototype.drawAllItems.call(this);
};

Rexal.VE.drawBlock2 = Window_Status.prototype.drawBlock2;
Window_Status.prototype.drawBlock2 = function(y) {

	this.removeParts();
Rexal.VE.drawBlock2.call(this,y);
};

Rexal.VE.drawFace = Window_Base.prototype.drawFace;
Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
	this._visual=false;
	Rexal.VE.drawFace.call(this);
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
bitmap = ImageManager.loadFace(faceName);
	this._fax = x;
	this._fay = y;

	this._bltArray = [];
	var pw = Window_Base._faceWidth;

    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;

		
	this.createCharacter(bitmap,faceName, faceIndex);
    if(!this._visual)this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

Window_Base.prototype.removeParts = function(){
	
	for(var i = 0; i<this.children.length; i++)
	{
		console.info(this.children[i]._isPart);
		
		if(this.children[i]._isPart)
		this.children[i].remove();
	
	}
	
}

Window_Base.prototype.createCharacter = function(bitmap,faceName,faceIndex) {
	

var sprites = [];

	console.debug('faceName = ' + faceName);console.debug('FaceIndex = ' + faceIndex);
   
   var actor = Rexal.VE.findActorByFace(faceName,faceIndex);
   
   if(actor)
   {	
var act = $dataActors[actor.actorId()];
Rexal.VE.processPartNoteTag(act);
this._visual = act._visual;
	if(act.sprites){
sprites = this.combineParts(sprites,act.sprites);
	}
	   var length = actor.equips().length;
	   console.debug('actor = ' + actor.name());
	   console.debug('amount of equips = ' + length);
	for(var i = 1; i<length; i++){

	var equip = actor.equips()[i];

	if(equip){
console.log('reading ' + equip.name +"...")
Rexal.VE.processPartNoteTag(equip);

	if(equip.sprites)
	{
		sprites = this.combineParts(sprites,equip.sprites);
	}
	
	}
	   else console.warn('Not wearing any ' + $dataSystem.equipTypes[i+1] + ' equipment...');
   }

   
   }
 
	if(sprites && actor){
		this._noblt = true;
		this.createParts(sprites,bitmap);
	}
		
	
 
//this.bitmap = ImageManager.loadCharacterPart(act.sprite); 

};

Window_Base.prototype.combineParts = function(array,array2){
var ar = array;
	for(var i = 0; i<array2.length; i++)
	{
		ar.push(array2[i]);
		console.info('added '+ array2[i]);
	}
	return ar;
}

Window_Base.prototype.findHighestPart = function(array){
var layer = 0;

for(var i = 0; i<array.length; i++){
var n = parseInt(array[i].split(',')[1]);
if(n>layer) layer = n;
	}
	console.info(layer + ' is the highest layer');
	return layer;
}


Window_Base.prototype.createParts = function(array,bitmap){
		var min = this.findLowestPart(array);
		
		var max = this.findHighestPart(array)+1;

		var newArray = [];

for(var i = min; i<max; i++)
{


	
	for(var s = 0; s<array.length; s++){
		
	var n = parseInt(array[s].split(',')[1]);
	var name = array[s].split(',')[0];
	var hue = eval(array[s].split(',')[2]);
	var saturation = eval(array[s].split(',')[3]);
	var value = eval(array[s].split(',')[4]);
	var hsv = [hue,saturation,value];
		console.log('Layer ' + i + ': '+'checking '+ name + '...');
	if(n == i){

	this.createPart(name,hsv,bitmap);
	
	console.info(name + ' is layer ' + i);
	}
	
	}
}

}

Window_Base.prototype.findLowestPart = function(array){
var layer = 0;

for(var i = 0; i<array.length; i++){
var n = parseInt(array[i].split(',')[1]);
if(n<layer) layer = n;
	}
	console.info(layer + ' is the lowest layer');
	return layer;
}

Window_Base.prototype.createPart = function(name,hsv) {
	
    var sprite = new Sprite_FacePart();
	sprite.bitmap = ImageManager.loadFacePart(name,hsv[0]);
	
	var sat = hsv[1]; console.info('updating hue, saturation and value...');
	var val = hsv[2];
	sprite.setColorTone([val, val, val, sat]);
	sprite.x = this._fax;
	sprite.y = this._fay;
	sprite.anchor.x = -.123;
    sprite.anchor.y = -.123;
	sprite.parent = this;
	sprite._isPart = true;
    this.addChild(sprite);
			console.info(sprite.parent);
	
};

function Sprite_FacePart() {

    this.initialize.apply(this, arguments);
}

 //-----------------------------------------------------------------------------
// Sprite_FacePart
//=============================================================================

Sprite_FacePart.prototype = Object.create(Sprite.prototype);
Sprite_FacePart.prototype.constructor = Sprite_FacePart;

Sprite_FacePart.prototype.update = function() {
    Sprite.prototype.update.call(this);
if(this._remove)this.parent.removeChild(this);
	
};

Sprite_FacePart.prototype.remove = function() {
	console.warn('removing ' + this);
	this._remove = true;
}



 //-----------------------------------------------------------------------------
// Rex Functions
//=============================================================================

Object.defineProperties(Game_Item.prototype, {
   sprites: { get: function() { return this._sprites; }, configurable: true }
});

Object.defineProperties(Game_Actor.prototype, {
   sprites: { get: function() { return this._sprite; }, configurable: true }
});

Rexal.VE.findActorBySprite = function(name,index){
if(Rexal.VE.Debug)console.log('Searching through ' + $dataActors.length + ' actors...')
	for(var i = 1; i<$dataActors.length; i++)
	{
		var actor = $gameActors.actor(i);
		if(Rexal.VE.Debug)console.debug(name + ' ' + index + ' -> '+actor._name);
		if(actor._characterName == name && actor._characterIndex == index)
		{	
		if(Rexal.VE.Debug)console.info('found ' + actor.name() + '!');
		return actor;
		}
	
	}
	if(Rexal.VE.Debug)console.error('Could not find the actor specified!');
}

Rexal.VE.findActorByFace = function(name,index){
if(Rexal.VE.Debug)console.log('Searching through ' + $dataActors.length + ' actors...')
	for(var i = 1; i<$dataActors.length; i++)
	{
		var actor = $gameActors.actor(i);
		if(Rexal.VE.Debug)console.debug(name + ' ' + index + ' -> '+actor._name);
		if(actor._faceName == name && actor._faceIndex == index)
		{	
		if(Rexal.VE.Debug)console.info('found ' + actor.name() + "'s face!");
		return actor;
		}
	
	}
	if(Rexal.VE.Debug)console.error("Could not find the actor's face!");
}

Rexal.VE.findActorByBattleSprite = function(name){
if(Rexal.VE.Debug)console.log('Searching through ' + $dataActors.length + ' actors...')
	for(var i = 1; i<$dataActors.length; i++)
	{
		var actor = $gameActors.actor(i);
		if(Rexal.VE.Debug)console.debug(name + ' ' +' -> '+actor._battlerName);
		if(actor._battlerName == name)
		{	
		if(Rexal.VE.Debug)console.info('found ' + actor.name() + "'s battler!");
		return actor;
		}
	
	}
	if(Rexal.VE.Debug)console.error("Could not find the actor's battler!");
}

Rexal.VE.processPartNoteTag = function(obj) {
	obj.layer = [];
	obj.sprites = [];
Rexal.VE._visual = false;
if(Rexal.VE.Debug)console.log('reading ' + obj.name + "'s notes");
if(!obj)return;

		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
		var line = notedata[i];
		if(Rexal.VE.Debug)console.debug('reading ' + line + '...');
		var lines = line.split(': ');
		switch (lines[0].toLowerCase()) {
			
		case '[ve actor]' :
		obj._visual = true;
		break;
		
		case 've image' :
		if(lines[1].split(',').length == 1)lines[1]+= ",0";
		if(lines[1].split(',').length == 2)lines[1]+= ",0";
		if(lines[1].split(',').length == 3)lines[1]+= ",0";
		if(lines[1].split(',').length == 4)lines[1]+= ",0";	
        obj.sprites.push(lines[1]);
		if(Rexal.VE.Debug)console.info(lines[1]);
		break;
		
		}
		
			
		}
};