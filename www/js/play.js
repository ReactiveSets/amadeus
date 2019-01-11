( this.undefine || require( 'undefine' )( module, require ) )()
( 'play', [ [ 'rs', 'toubkal' ] ], function( rs ) {
  "use strict";
  
  var tracks = [ 0, 1, 2, 3, 4, 5 ].map( function( track ) {
    var sound = 'https://amadeus.reactane.com/sounds/' + track + '.mp3';
    
    // from https://stackoverflow.com/questions/11330917/how-to-play-a-mp3-using-javascript
    var audio = document.createElement( "audio" );
    
    audio.preload = "auto";
    
    var src = document.createElement( "source" );
    
    src.src = sound;
    
    audio.appendChild( src );
    
    console.log( 'created audio element for track:', sound )
    
    return audio;
  } )
  
  return rs
    
    /* ---------------------------------------------------------------------------------------------------------------------
      @pipelet playback( play, database_cache, options )
      
      @description
      playback audio if play is on, from beats comming from flow amadeus_beats, and sequencer from database_cache
      
      @source
      - play \\<Boolean>:
        - 0: not playing
        - 1: play
    */
    .Compose( 'playback', function( source, database_cache, options ) {
      var rs = source.namespace();
      
      var subscription = source
        
        .filter( [ { play: 1 } ] )
        
        .pick( { flow: 'amadeus_beats' } )
      ;
      
      var sequencer = database_cache
        
        .flow( 'sequencer' )
        
        .map( function( _ ) {
          if ( _.user_id ) {
            var id             = _.id
              , track_sequence = id.split( '-' ).map( function( _ ) { return +_ } )
              , track          = track_sequence[ 0 ]
              , sequence       = track_sequence[ 1 ]
            ;
            
            return {
              id      : id,
              sequence: sequence,
              track   : track
            }
          }
        } )
        
        .set()
      ;
      
      rs
        .socket_io_server()
        
        .filter( subscription )
        
        .trace( 'amadeus_beats' ).greedy()
        
        .fetch( sequencer, { sequence: '.sequence' } )
        
        //.trace( 'tracks to play' )
        
        .map( function( fetched ) {
          var tracks = fetched.values;
          
          tracks.forEach( function( _ ) {
            var track = _.track
              , audio = tracks[ track ]
            ;
            
            console.log( 'playing audio of track:', track )
            
            audio.currentTime = 0.01;
            audio.volume = 1;
            
            //Due to a bug in Firefox, the audio needs to be played after a delay
            setTimeout( function(){
              audio.play()
            }, 1 );
          } )
        } )
      ;        
    } ) // pipelet playback()
    
    //.set( [ { play: 1 } ] )
    
    //.playback( rs.database_cache() )
  ;
} );
