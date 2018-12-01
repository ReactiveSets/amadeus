#!/usr/bin/env node

/*
  fake_data.js
  
*/

var rs = require( 'toubkal' );

require( 'toubkal_mysql' )( rs );

require( './database.js' )( rs );

var database = rs.database()
  , uuid_v4  = rs.RS.uuid.v4
  , extend   = rs.RS.extend
  , values   = []
;

for( var i = -1; ++i < 5; ) {
  for( var j = -1; ++j < 10; ) {
    values.push( {
        id: i + '-' + 'j'
      , flow: 'sequencer'
    } );
  } // j
} // i

rs
  .set( values )
  
  .trace( 'sequencer' )
  
  .greedy()
;