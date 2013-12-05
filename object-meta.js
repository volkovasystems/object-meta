/*
	The meta function here is the basic meta function for Interface.
	It basically reads a simple rule configuration.
	{
		"ruleKey[:optional]": type[-type][|type...][:defaultValue|...][~linkedProperty] 
	}

	- group of types
	| or separator
	: default value
	~ linked property

	Because we don't want to expose the Arguments
*/
( function local( ){
	var Arguments;
	var dummyMethod = function dummyMethod( ){
		/*
			This is a clever hack to access the "Arguments"
				object.
		*/
		Arguments = arguments.constructor;
	};
	dummyMethod( );

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
				if( this instanceof Arguments ){
					if( !( parameter instanceof Arguments ) ){
						//We don't have to worry about the parameter.
						//And we assume that the parameter if not an Arguments then it is rules.
						rules = parameter;
						parameter = Array.prototype.slice.call( this, 0 );
					}else{
						parameter = Array.prototype.slice.call( parameter, 0 );
					}
					var callee = this.callee;
					var parameterList = callee.toString( )
						.match( /function\s+(?:[$_a-zA-z][\w$\d]*)?\s*\(([^\(\)]*)\)/ )[ 1 ]
						.replace( /\s/g, "" )
						.split( "," );
					
					console.debug( parameterList );
					//console.debug( parameter.toString() );
					//console.debug( this.callee.toString() ); 
				}else{

				}	
			}
		} );
} )( );



