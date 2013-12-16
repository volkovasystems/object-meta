/*
	The meta function here is the basic meta function for Interface.
	It basically reads a simple rule configuration.
	{
		"ruleKey[:optional]": type[-type][|type...][:defaultValue|...][~linkedProperty] 
	}

	~ linked property *	 	priority 0
	: default value *	 	priority 0
	- group of types		priority 1
	| or separator		  	priority 2
	; meta mutator          priority 3
	
	The best part in this meta function is that its support for arguments variable
		which is present in all functions.

	By doing arguments.meta( ) we can check for the rules.
*/
Object.defineProperty( Object.prototype, "meta",
	{
		"enumerable": false,
		"configurable": true,
		"writable": false,
		"value": function meta( parameter, rules ){
			/*
				Parameter is where you will pass the arguments.
				And rules should be a plain object following
					the correct configuration for meta.
			*/
			console.debug( "Parameter: ", parameter );
			var argumentsIdentity = this.toString( );
			var argumentsPattern = /^\[\s*object\s+Arguments\s*\]$/;
			if( argumentsPattern.test( argumentsIdentity ) ){
				if( !argumentsPattern.test( parameter.toString( ) ) ){
					//We don't have to worry about the parameter.
					//And we assume that the parameter if not an Arguments then it is rules.
					rules = parameter;
					parameter = Array.prototype.slice.call( this, 0 );
					console.debug( "Rules: ", rules );
				}else{
					parameter = Array.prototype.slice.call( parameter, 0 );
				}
			}else if( parameter && rules ){
				parameter = Array.prototype.slice.call( parameter, 0 );
			}else{
				throw new Error( "invalid arguments" );
			}
			console.debug( "Parameters: ", parameter );

			var callee = this.callee;
			var parameterList = callee.toString( )
				.match( /function\s+(?:[$_a-zA-z][\w$\d]*)?\s*\(([^\(\)]*)\)/ )[ 1 ]
				.replace( /\s/g, "" )
				.split( "," );
			
			console.debug( "Parameter list: ", parameterList );
			
			//Save memory for regex patterns.
			var groupPattern = /\-/g;
			var orPattern = /\|/g;
			var defaultValueAndLinkedToPattern = /^(?:\:|\~)/;
			var defaultValuePattern = /^\:/;
			var linkedToPattern = /^\~/;
			var splitRulePattern = /(?=\~)|\b(?=\:)/g;
			
			//Process the rules.
			var splittedRule = null;
			for( var parameterKey in rules ){
				var rule = rules[ parameterKey ];
				splittedRule = rule.split( splitRulePattern );
				var ruleConfiguration = { };
				for( var index in splittedRule ){
					var subRule = splittedRule[ index ];
					if( groupPattern.test( subRule ) ){
						//Then this contains a grouping.
						var types = subRule.split( groupPattern );
						var mainType = types[ 0 ];
						var subTypes = types[ 1 ];
						if( orPattern.test( subTypes ) ){
							subTypes = subTypes.split( orPattern );
						}
						ruleConfiguration.mainType = mainType;
						ruleConfiguration.subTypes = subTypes;
					}else if( orPattern.test( subRule )
						&& !defaultValueAndLinkedToPattern.test( subRule ) )
					{
						/*
							Assuming this should not be for default values
								or linked parameters.
							Then this contains a series of type?
						*/
						var types = subRule.split( orPattern );
						ruleConfiguration.types = types;
					}else{
						switch( subRule[ 0 ] ){
							case ":":
								//Then this is a default value.
								var defaultValue = subRule.replace( defaultValuePattern, "" );
								eval( "defaultValue = " + defaultValue );
								ruleConfiguration.defaultValue = defaultValue;
								break;
								
							case "~":
								/*
									This is a linked parameter.
									Note that linked parameter is applicable only to second 
										and succeeding parameters.
								*/
								var linkedTo = subRule.replace( linkedToPattern, "" );
								/*
								    If we remove this re-initialization this will be buggy and
								        I don't know why this is happening.
								*/
								orPattern = /\|/g;
								if( orPattern.test( linkedTo ) ){
									linkedTo = linkedTo.split( orPattern );
								}else{
									linkedTo = [ linkedTo ]
								}
								ruleConfiguration.linkedTo = linkedTo;
								break;
								
							default:
								throw new Error( "unsupported operator symbol" );
						}
					}
				}
				rules[ parameterKey ] = ruleConfiguration;
			}
			console.debug( "Rule configuration: ", rules );
			//console.debug( parameter.toString() );
			//console.debug( this.callee.toString() );

			for( var index in parameterList ){
				var parameterKey = parameterList[ index ];
				parameterList[ index ] = rules[ parameterKey ];
			}
			rules = parameterList;
			console.debug( "Ordered rules: ", rules );

			
		}
	} );