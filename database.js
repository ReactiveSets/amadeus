/*  database.js
    -----------
    
    Application Database
    
    Licence
    
*/
module.exports = function( rs ) {
  'use strict';
  
  require( './beat' )( rs );
  
  /* --------------------------------------------------------------------------
     Timestamp converter
  */
  var timestamp_converter = {
    // JavaScript Date to MySQL VARCHAR
    parse: function( t ) {
      // console.log( 'parse:', t );
      
      return new Date( t ).toISOString(); // e.g. 2018-07-22T14:55:34.000Z
    },
    
    // MySQL VARCHAR to JavaScript Date
    serialize: function( t ) {
      // console.log( 'serialize:', t );
      
      return t && new Date( t );
    }
  };
  
  /* --------------------------------------------------------------------------
     Database Schema
  */
  var schema = rs.set( [
    // This schema set
    { id : 'schema', engine: 'self' },
    
    // users table
    {
      id     : 'users',
      columns: [
        { id: 'id', converter: 'uuid_b16' },
        'email',
        'first_name',
        'last_name',
        'photo',
        { id: 'timestamp', converter: timestamp_converter }
      ]
    },
    
    // users_providers table
    {
      id     : 'users_providers',
      columns: [
        { id: 'id'     , converter: 'uuid_b16' },
        { id: 'user_id', converter: 'uuid_b16' },
        'provider_id', 'provider_name', 'profile'    
      ]
    },
    
    // sequencer table
    {
      id     : 'sequencer',
      columns: [ 'id', { id: 'user_id', converter: 'uuid_b16' } ]
    },
    
    // tracks table
    {
      id: 'tracks',
      columns: [ 'id', 'name', 'icon', 'sound' ]
    },
    
    {
      id: 'amadeus_beats',
      
      //debug: 'true',
      
      engine: function( input ) {
        return input.amadeus_beats( 2000 )
      }
    }
  ] );
  
  /* --------------------------------------------------------------------------
     Database Singleton
  */
  rs.Singleton( 'database', function( source, options ) {
    var RS          = source.RS
      , is_function = RS.is_function
      , is_string   = RS.is_string
    ;
    
    return source.dispatch( schema, table );
    
    function table( source, options ) {
      var table_name    = this.id
        , key           = this.key || [ 'id' ]
        , engine        = this.engine || 'mysql'
        , debug         = this.debug
        , debug_options = typeof( debug ) == 'object' ? debug: null
        , input
        , table
      ;
      
      input = source
        .flow( table_name )
        
        .debug( debug, table_name + ' in', debug_options )
        
        .remove_destination_with( source )
      ;
      
      if ( is_function( engine ) ) {
        table = engine( input );
      
      } else if ( is_string( engine ) ) {
        switch( engine ) {
          case 'self':
            table = input.through( schema );
          break;
          
          case 'mysql':
            table = input
              .mysql( table_name, this.columns, {
                  mysql   : { database: 'amadeus' }
                , key     : key
              } )
            ;
          break;
        } // switch( engine )
      }
      
      return table
        .debug( debug, table_name + ' out', debug_options )
        
        .set_flow( table_name )
        
        .remove_source_with( source )
      ;
    } // table()
  } );
  
  return (function( schema ){
    var schema_dataflow = rs
      .database()
      
      .flow( 'schema' )
    ;
    
    schema_add( schema_dataflow._output
      
      .on( 'add', schema_add )
      
      .on( 'remove', function( removes ) {
        removes.forEach( function( table ) {
          delete schema[ table.id ];
        } )

        // console.log( 'schema after removes:', schema );
      } )
      
      .on( 'update', function( updates ) {
        updates.forEach( function( update ) {
          delete schema[ update[ 0 ].id ];

          schema[ update[ 1 ].id ] = update[ 1 ];
        } )

        // console.log( 'schema after updates:', schema );
      } )
      
      .fetch_all()
    );
    
    schema_dataflow.greedy();
    
    return schema;
    
    function schema_add( adds ) {
      adds && adds.forEach( function( table ) {
        schema[ table.id ] = table;
      } )

      // console.log( 'schema after adds:', schema );
    } // schema_add()
  } )( {} ); // Get schema
  
}; // module.export
