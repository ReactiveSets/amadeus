/*
    Licence
*/
( this.undefine || require( 'undefine' )( module, require ) )()
( 'main', [ [ 'rs', 'toubkal' ] ], function( rs ) {
  "use strict";
  
  // --------------------------------------------------------------------------
  // database schema
  var schema = [
    { id: 'login_strategies' },
    { id: 'profile'          },
    { id: 'tracks'           },
    { id: 'sequencer'        }
  ];
  
  // dataflows Array for pipelet delivers()
  var dataflows = schema.map( function( _ ) { return _.id } );
  
  // --------------------------------------------------------------------------
  // login strategies or profile
  var strategies_or_profile = rs
    .socket_io_server()
    
    .strategies_or_profile()
    
    // .trace().greedy()
  ;
  
  // --------------------------------------------------------------------------
  // sign-in page
  strategies_or_profile
    .flow( 'login_strategies' )
    
    .$signin( 'body' )
  ;
  
  // --------------------------------------------------------------------------
  // main container
  var $main = strategies_or_profile
    .flow( 'profile' )
    
    .pick( { id: 'main' , tag: 'main' } )
    
    .$to_dom( 'body' )
  ;
  // --------------------------------------------------------------------------
  // main pipeline:
  // database cache ==> application ==> database cache
  //                                ==> socket.io server ==> database cache
  rs
    .database_cache( rs.set( schema ), {
      synchronizing: rs.socket_io_synchronizing()
    } )
    
    // untag transactions from socket_io_synchronizing()
    .pass_through( { untag: 'synchronizing' } )
    
    // Filter-out early non-cached dataflows queries and fetches comming from application routes
    .delivers( dataflows )
    
    // application
    .route( rs.url_route(), $main )
    
    .delivers( dataflows )
    
    .set_reference( 'updates' )
    
    .database_cache()
    
    // also send application updates to socket.io server
    .reference( 'updates' )
    
    .trace( 'to socket_io_server', { all: true } )
    
    .socket_io_server()
    
    .database_cache()
  ;
} ); // module.export
