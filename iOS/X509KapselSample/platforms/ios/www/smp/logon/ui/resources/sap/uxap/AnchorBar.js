/*!
 * SAP.${maven.build.timestamp} UI development toolkit for HTML5 (SAPUI5) (c) Copyright
 * 		2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.uxap.AnchorBar");jQuery.sap.require("sap.uxap.library");jQuery.sap.require("sap.m.Toolbar");sap.m.Toolbar.extend("sap.uxap.AnchorBar",{metadata:{publicMethods:["scrollToSection","getScrollDelegate"],library:"sap.uxap",properties:{"showPopover":{type:"boolean",group:"",defaultValue:true}},associations:{"selectedButton":{type:"sap.m.Button",multiple:false}}}});jQuery.sap.require("sap.uxap.HierarchicalSelect");jQuery.sap.require("sap.ui.core.Item");jQuery.sap.require("sap.ui.core.ResizeHandler");jQuery.sap.require("sap.m.Popover");jQuery.sap.require("sap.m.PlacementType");jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
sap.uxap.AnchorBar.prototype.init=function(){if(sap.m.Toolbar.prototype.init){sap.m.Toolbar.prototype.init.call(this)}this.addStyleClass("sapUxAPAnchorBar");this._aPopovers=[];this._oPressHandlers={};this._oSectionInfo={};this._oPhoneAction=null;this._oScroller=null;this._oArrowLeft=null;this._oArrowRight=null;this._$phone=[];this._bRtlScenario=sap.ui.getCore().getConfiguration().getRTL()&&!sap.ui.Device.browser.msie;this._bPhoneScenario=sap.ui.Device.system.phone||sap.ui.Device.system.desktop;this._bTabletScenario=sap.ui.Device.system.tablet||sap.ui.Device.system.desktop;if(this._bTabletScenario){this._oScroller=new sap.ui.core.delegate.ScrollEnablement(this,this.getId()+"-scroll",{horizontal:true,vertical:false,nonTouchScrolling:true});this._oArrowLeft=sap.m.ImageHelper.getImageControl(this.getId()+"-arrowScrollLeft",this._oArrowLeft,this,{src:"sap-icon://navigation-left-arrow"},["sapMITBArrowScroll","sapMITBArrowScrollLeft","sapUxAPAnchorBarArrowScroll"]);this._oArrowRight=sap.m.ImageHelper.getImageControl(this.getId()+"-arrowScrollRight",this._oArrowRight,this,{src:"sap-icon://navigation-right-arrow"},["sapMITBArrowScroll","sapMITBArrowScrollRight","sapUxAPAnchorBarArrowScroll"]);this._iREMSize=parseInt(jQuery("body").css("font-size"),10);this._iTolerance=this._iREMSize*3;this._sResizeListenerId=undefined}if(this._bPhoneScenario){this._oPhoneAction=new sap.uxap.HierarchicalSelect({width:"100%",change:jQuery.proxy(this._onPhoneSelectChange,this)});this._oPhoneAction.setParent(this)}this.setDesign("Transparent")};
sap.uxap.AnchorBar.SCROLL_STEP=250;sap.uxap.AnchorBar.SCROLL_DURATION=500;sap.uxap.AnchorBar.DOM_CALC_DELAY=200;
sap.uxap.AnchorBar.prototype.setSelectedButton=function(b){if(typeof b==="string"){b=sap.ui.getCore().byId(b)}if(b){if(this._bTabletScenario){this.$().find(".sapUxAPAnchorBarButtonSelected").removeClass("sapUxAPAnchorBarButtonSelected");b.$().addClass("sapUxAPAnchorBarButtonSelected")}if(b.data("sectionId")){if(this._bTabletScenario){this.scrollToSection(b.data("sectionId"),sap.uxap.AnchorBar.SCROLL_DURATION)}if(this._bPhoneScenario){this._oPhoneAction.setSelectedKey(b.getId())}}}return this.setAssociation("selectedButton",b,true)};
sap.uxap.AnchorBar.prototype.setShowPopover=function(v,s){var S,n=!jQuery.isEmptyObject(this._oPressHandlers);if(n){var c=this.getContent()||[];S=this.getSelectedButton();jQuery.each(c,jQuery.proxy(function(i,b){if(this._oPressHandlers[b.getId()]){b.detachPress(this._oPressHandlers[b.getId()]);this._oPressHandlers[b.getId()]=null}},this))}this.setProperty("showPopover",v,true);if(n){this.rerender();if(S){this.setSelectedButton(S)}}return this};
sap.uxap.AnchorBar.prototype.onBeforeRendering=function(){if(sap.m.Toolbar.prototype.onBeforeRendering){sap.m.Toolbar.prototype.onBeforeRendering.call(this)}var c=this.getContent()||[],l=null,C=null,p,P=null;if(this._bPhoneScenario){this._oPhoneAction.removeAllItems()}jQuery.each(c,jQuery.proxy(function(i,b){var I=b.data("secondLevel")===true||b.data("secondLevel")==="true";if(this._bPhoneScenario){if(b.getText().trim()!=""&&(!I||b.data("phoneVisibility")===true)){p=new sap.ui.core.Item({key:b.getId(),text:b.getText(),customData:[new sap.ui.core.CustomData({key:"secondLevel",value:b.data("secondLevel")})]});this._oPhoneAction.addItem(p)}}if(this._bTabletScenario){if(I){if(l&&C){if(!this._oPressHandlers[l.getId()]){P=jQuery.proxy(function(e){var a=this.oCurrentPopover.getContent()||[];if(this.oLastFirstLevelButton.$().is(":visible")){if(a.length==1){a[0].firePress({})}else{this.oCurrentPopover.openBy(this.oLastFirstLevelButton)}}},{oCurrentPopover:C,oLastFirstLevelButton:l});l.attachPress(P);this._oPressHandlers[l.getId()]=P}C.addContent(b)}else if(this.getShowPopover()){jQuery.sap.log.error("sapUxApAnchorBar :: missing parent first level for item "+b.getText())}else{this.removeContent(b)}}else{l=b;if(this.getShowPopover()){C=new sap.m.Popover({placement:sap.m.PlacementType.Bottom,showHeader:false,verticalScrolling:true,horizontalScrolling:false,contentWidth:"auto"});C.openBy=jQuery.proxy(function(o){var a=jQuery.inArray(sap.m.PlacementType.Bottom,this._placements);this._arrowOffset=0;this._offsets[a]="0 0";sap.m.Popover.prototype.openBy.apply(this,arguments)},C);C.addStyleClass("sapUxAPAnchorBarPopover");this._aPopovers.push(C)}else{if(!this._oPressHandlers[l.getId()]){P=jQuery.proxy(function(e){if(this.getParent()instanceof sap.uxap.ObjectPageLayout){this.getParent().scrollToSection(e.getSource().data("sectionId"))}},this);l.attachPress(P);this._oPressHandlers[l.getId()]=P}}}}},this))};
sap.uxap.AnchorBar.prototype.addContent=function(b,i){b.addStyleClass("sapUxAPAnchorBarButton");if(this._bTabletScenario&&(b.data("secondLevel")===true||b.data("secondLevel")==="true")){b.attachPress(function(e){if(e.getSource().getParent()instanceof sap.m.Popover){e.getSource().getParent().close()}if(this.getParent()instanceof sap.uxap.ObjectPageLayout){this.getParent().scrollToSection(e.getSource().data("sectionId"))}},this)}return this.addAggregation("content",b,i)};
sap.uxap.AnchorBar.prototype._onPhoneSelectChange=function(e){var s=e.getParameter("selectedItem"),o;o=sap.ui.getCore().byId(s.getKey());if(o){if(o.firePress){o.firePress({})}if(this.getParent()instanceof sap.uxap.ObjectPageLayout){this.getParent().scrollToSection(o.data("sectionId"))}}else{jQuery.sap.log.error("AnchorBar :: cannot find corresponding button",s.getKey())}};
sap.uxap.AnchorBar.prototype._adjustSize=function(){var $=this.$(),n,N,c;if(this._$phone.length>0&&this._$phone.is(":visible")){return}if(this._iMaxPosition<0){return}c=this.$().parent().width();if(this._bRtlScenario){N=this._oScroller.getScrollLeft()>=this._iTolerance;n=this._oScroller.getScrollLeft()+c<this._iMaxPosition}else{N=this._oScroller.getScrollLeft()+c<this._iMaxPosition;n=this._oScroller.getScrollLeft()>=this._iTolerance}jQuery.sap.log.debug("AnchorBar :: scrolled at "+this._oScroller.getScrollLeft(),"scrollBegin ["+(n?"true":"false")+"] scrollEnd ["+(N?"true":"false")+"]");$.toggleClass("sapUxAPAnchorBarScrollLeft",n);$.toggleClass("sapUxAPAnchorBarScrollRight",N)};
sap.uxap.AnchorBar.prototype.ontap=function(e){var t=e.target.id,i=this.getId(),d=this._bRtlScenario?-1:1;if(t==i+"-arrowScrollLeft"){e.preventDefault();this._oScroller.scrollTo(Math.max(this._oScroller.getScrollLeft()-sap.uxap.AnchorBar.SCROLL_STEP*d,0),0,sap.uxap.AnchorBar.SCROLL_DURATION)}else if(t==i+"-arrowScrollRight"){e.preventDefault();this._oScroller.scrollTo(this._oScroller.getScrollLeft()+sap.uxap.AnchorBar.SCROLL_STEP*d,0,sap.uxap.AnchorBar.SCROLL_DURATION)}};
sap.uxap.AnchorBar.prototype.scrollToSection=function(i,d){if(this._bTabletScenario){var D=d||sap.uxap.AnchorBar.SCROLL_DURATION,s;if((this._$phone.length==0||!this._$phone.is(":visible"))&&this._oSectionInfo[i]){s=this._oSectionInfo[i].scrollLeft-this._iTolerance;jQuery.sap.log.debug("AnchorBar :: scrolling to section "+i+" of "+s);if(this._sCurrentScrollId!=i){this._sCurrentScrollId=i;if(this._iCurrentScrollTimeout){jQuery.sap.clearDelayedCall(this._iCurrentScrollTimeout);jQuery.sap.byId(this.getId()+"-scroll").parent().stop(true,false)}this._iCurrentScrollTimeout=jQuery.sap.delayedCall(d,this,function(){this._sCurrentScrollId=undefined;this._iCurrentScrollTimeout=undefined});this._oScroller.scrollTo(s,0,D)}}else{jQuery.sap.log.debug("AnchorBar :: no need to scroll to "+i)}}};
sap.uxap.AnchorBar.prototype.getScrollDelegate=function(){return this._oScroller};
sap.uxap.AnchorBar.prototype.onAfterRendering=function(){if(sap.m.Toolbar.prototype.onAfterRendering){sap.m.Toolbar.prototype.onAfterRendering.call(this)}if(this._bPhoneScenario){this._$phone=this._oPhoneAction.$()}this._iMaxPosition=-1;this._sResizeListenerId=sap.ui.core.ResizeHandler.register(this,jQuery.proxy(this._adjustSize,this));this.$().find(".sapUxAPAnchorBarScrollContainer").scroll(jQuery.proxy(function(){if(!this._iCurrentSizeCheckTimeout){this._iCurrentSizeCheckTimeout=jQuery.sap.delayedCall(sap.uxap.AnchorBar.SCROLL_DURATION,this,function(){this._iCurrentSizeCheckTimeout=undefined;this._adjustSize()})}},this));if(this._bTabletScenario){jQuery.sap.delayedCall(sap.uxap.AnchorBar.DOM_CALC_DELAY,this,function(){var c=this.getContent()||[];this._iMaxPosition=0;jQuery.each(c,jQuery.proxy(function(i,C){var w=C.$().outerWidth(true);this._oSectionInfo[C.data("sectionId")]={scrollLeft:this._iMaxPosition,width:w};this._iMaxPosition+=w},this));if(this._bRtlScenario){if(sap.ui.Device.browser.webkit){jQuery.each(c,jQuery.proxy(function(i,C){var s=this._oSectionInfo[C.data("sectionId")];s.scrollLeft=this._iMaxPosition-s.scrollLeft-s.width},this));this._oScroller.scrollTo(this._iMaxPosition,0,0)}}this._adjustSize()})}if(this.getSelectedButton()){this.setSelectedButton(this.getSelectedButton())}};
sap.uxap.AnchorBar.prototype.exit=function(){if(this._oPhoneAction){this._oPhoneAction.destroy();this._oPhoneAction=null}if(this._oArrowLeft){this._oArrowLeft.destroy();this._oArrowLeft=null}if(this._oArrowRight){this._oArrowRight.destroy();this._oArrowRight=null}if(this._aPopovers){jQuery.each(this._aPopovers,function(i,a){a.destroy();a=null})}if(this._sResizeListenerId){sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);this._sResizeListenerId=null}if(this._oScroller){this._oScroller.destroy();this._oScroller=null}};