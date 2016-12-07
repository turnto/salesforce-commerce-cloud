'use strict';
/**
 * GetProductQA.js
 *
 * The script does a server call to get the QA data from TurnTo. 
*
* @input CurrentHttpParameterMap : dw.web.HttpParameterMap 
* @output catItemHtml : String
*
*/

function execute(args)
{    
   	try {
   		args.catItemHtml = getProductQA(args.CurrentHttpParameterMap.pid.stringValue);
   	}
   	catch(e) {
   		var ex = e;
   		return PIPELET_ERROR;	
   	}
   	
	return PIPELET_NEXT;
}

function getProductQA(pid) {
	/* API Includes */
	var Site = require('dw/system/Site');
	var ProductMgr = require('dw/catalog/ProductMgr');
	var ServiceRegistry = require('dw/svc/ServiceRegistry');
	
	var svc = 'turnto.http.static.qa.get';
	var append = 'catitemhtml';
	var html = '<div id="TurnToContent"></div>';
	
	if(pid != null)
	{
		var product = ProductMgr.getProduct(pid);
		pid = product.isVariant() ? product.masterProduct.ID : product.ID;
	}
	
   	var turntoStaticUrl:String= Site.getCurrent().getCustomPreferenceValue('turntoStaticURL');
   	var siteKey:String= Site.getCurrent().getCustomPreferenceValue('turntoSiteKey');
   	var version:String = Site.getCurrent().getCustomPreferenceValue('turntoVersionNumber');	   			   
	var service:Service = ServiceRegistry.get(svc);
	service.URL = turntoStaticUrl + '/sitedata/' + siteKey + "/v" + version.replace('.', '_') + "/" + pid + "/d/" + append;
	var result:Result = service.call();		
	if (result.isOk()) {	
		return result.getObject().toString();		
	} else {
		return html;
	}
}

module.exports = {
    execute: execute,
    getProductQA: getProductQA
};