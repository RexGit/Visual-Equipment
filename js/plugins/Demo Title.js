//=============================================================================
 /*:
 * @plugindesc Demo-Specific Title Screen Changes
 * :D
 * @author Rexal
 */
//=============================================================================

Window_EquipSlot.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._itemWindow) {
       if(this.index()!=6) this._itemWindow.setSlotId(this.index());
    }
};


Scene_Title.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
	this._commandWindow.setHandler('Cutscene',  this.commandCutscene.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};

Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand('Start Demo',   'newGame');
	this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
	this.addCommand('Start Cutscene','Cutscene');
    this.addCommand(TextManager.options,   'options');
};

Scene_Title.prototype.commandCutscene = function() {
    DataManager.setupNewGame();
    this._commandWindow.close();
    this.fadeOutAll();	//$gameSwitches.setValue(1,true);
   SceneManager.push(Scene_Cutscene);
};

Scene_Title.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    this._commandWindow.close();
   SceneManager.push(Scene_Travel);
};

//-----------------------------------------------------------------------------
// Scene_Travel
//
// The scene class of the travel screen.

function Scene_Travel() {
    this.initialize.apply(this, arguments);
}

Scene_Travel.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Travel.prototype.constructor = Scene_Travel;

Scene_Travel.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Travel.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createtravelWindow();
};

Scene_Travel.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
};

Scene_Travel.prototype.createtravelWindow = function() {
    this._travelWindow = new Window_Travel();
    this._travelWindow.setHandler('cancel', this.popScene.bind(this));
	 this._travelWindow.setHandler('diegohouse',  this.travelDiego.bind(this));
	 this._travelWindow.setHandler('fortwallgard',  this.travelWallgard.bind(this));
	 this._travelWindow.setHandler('teconrs',  this.travelEvilCastle.bind(this));
	 this._travelWindow.setHandler('weaponshop',  this.travelWeapon.bind(this));
    this.addWindow(this._travelWindow);
};

Scene_Travel.prototype.travelDiego = function() {
    this._travelWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
	 $gamePlayer.reserveTransfer(1, 8, 6, 0, 0);
};

Scene_Travel.prototype.travelWeapon = function() {
    this._travelWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
	 $gamePlayer.reserveTransfer(16, 7, 12, 0, 0);
};

Scene_Travel.prototype.travelWallgard = function() {
    this._travelWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
	 $gamePlayer.reserveTransfer(2, 10, 38, 0, 0);
};

Scene_Travel.prototype.travelEvilCastle = function() {
    this._travelWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
	 $gamePlayer.reserveTransfer(3, 24, 43, 0, 0);
};

WMCAOC = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
	WMCAOC.call(this);
	 this.addCommand("Fast Travel", 'travel');
};

SMCCW = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
	SMCCW.call(this);
      this._commandWindow.setHandler('travel',    this.commandTravel.bind(this));
};

Scene_Menu.prototype.commandTravel = function() {
    SceneManager.push(Scene_Travel);
};


//-----------------------------------------------------------------------------
// Window_Travel
//
// The window for changing various settings on the options screen.

function Window_Travel() {
    this.initialize.apply(this, arguments);
}

Window_Travel.prototype = Object.create(Window_Command.prototype);
Window_Travel.prototype.constructor = Window_Travel;

Window_Travel.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
};

Window_Travel.prototype.windowWidth = function() {
    return 400;
};

Window_Travel.prototype.windowHeight = function() {
    return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
};

Window_Travel.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_Travel.prototype.makeCommandList = function() {
    this.addOptions();
};

Window_Travel.prototype.addOptions = function() {

	this.addText("Animated Enemies-");
    this.addCommand("The Arena", 'arena',false);
	this.addText("Random Enemies-");
	this.addCommand("Fort Wallgard", 'fortwallgard');
	this.addText("Visual Equipment-");
    this.addCommand("Diego's House", 'diegohouse');
	this.addCommand("The Evil Castle of no Real Significance", 'teconrs');
	this.addText("Weapon Sprites Enhanced-");
	this.addCommand("Weapon Shop", 'weaponshop',true);
};

Window_Travel.prototype.select = function(index) {

		
	if(this._list[index] && this._list[index].text){
	if(Input.isTriggered('up'))index--; else index++;
	}
		if(index<0)index = this.maxItems()-1;
	
		
Window_Selectable.prototype.select.call(this, index);

};

Window_Travel.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index)||this._list[index].text);
	if(this._list[index].text)this.changeTextColor(this.textColor(4));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_Travel.prototype.addText = function(name) {
    this._list.push({ name: name, text:true});
};


function Scene_Cutscene() {
    this.initialize.apply(this, arguments);
}

Scene_Cutscene.prototype = Object.create(Scene_Travel.prototype);
Scene_Cutscene.prototype.constructor = Scene_Cutscene;


Scene_Cutscene.prototype.createtravelWindow = function() {
    this._travelWindow = new Window_Cutscene();
    this._travelWindow.setHandler('cancel', this.popScene.bind(this));
	 this._travelWindow.setHandler('aganhs',  this.aganhs.bind(this));
    this.addWindow(this._travelWindow);
};

Scene_Travel.prototype.aganhs = function() {
    this._travelWindow.close();
		 	$gameSwitches.setValue(1,true);
    SceneManager.goto(Scene_Map);
	 $gamePlayer.reserveTransfer(1, 8, 6, 0, 0);

};


//------------------------------------------------------------------------------------------------------------------------------------------------------------------

function Window_Cutscene() {
    this.initialize.apply(this, arguments);
}

Window_Cutscene.prototype = Object.create(Window_Travel.prototype);
Window_Cutscene.prototype.constructor = Window_Cutscene;

Window_Cutscene.prototype.addOptions = function() {
	this.addText("Visual Equipment");
    this.addCommand("Alvin gets a new hair style", 'aganhs');

};
