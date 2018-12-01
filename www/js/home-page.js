/*
  home-page.js
  ------------

  Copyright (c) 2018, Reactane, all rights reserved.

*/

( this.undefine || require( 'undefine' )( module, require ) )()
( 'home-page', [ [ 'rs', 'toubkal' ] ], function( rs ) {
  "use strict";
  
  return rs
    
    /* ---------------------------------------------------------------------------------------------------------------------
      @pipelet $amadeus( $selector, options )
      
      @description:
      
      @source:
      
      @parameters
      - $selector (String/Pipelet):
      - options           (Object): optionnal object

    */
    .Compose( '$amadeus', function( source, $selector, options ) {
      var rs = source.namespace();
      
      // ----------------------------------------------------------
      // page items
      var $items = rs
        .set( [
          {
              id: 'container'
            , tag: 'div'
            , attributes: { class: 'container' }
          },
          {
              id: 'controls'
            , tag: 'div'
            , attributes: { class: 'section controls' }
          }
        ] )
        
        .$to_dom( $selector )
        
        .set()
      ;
      
      var $containers = $items
        .filter( [ { id: 'container' } ] )
        
        .flat_map( function( _ ) {
          return [
            {
                id: 'header'
              , tag: 'header'
              , $node: $
              , attributes: { class: 'columns columns--middle is-mobile' }
            },
            {
                id: 'form'
              , tag: 'form'
              , $node: $
              , attributes: { class: 'sequencer' }
            }
          ]
        } )
        
        .$to_dom()
      ;
      
      var $controls = $items
        .filter( [ { id: 'controls' } ] )
        
        .map( function( _ ) {
          return {
              id: 'control-container'
            , tag: 'div'
            , $node: _.$node
            , attributes: { class: 'container'  }
          }
        } )
        
        .$to_dom()
        
        .map( function( _ ) {
          return {
              id: 'control-columns'
            , tag: 'div'
            , $node: _.$node
            , attributes: { class: 'columns columns--little column--middle is-mobile'  }
          }
        } )
        
        .$to_dom()
        
        .flat_map( function( _ ) {
          return [ 'basse', 'big-caisse', 'caisse', 'cymbale', 'cymbale-ride' ]
            .map( function( v )
              return {
                  id: 'column-' + v
                , tag: 'div'
                , attributes: { class: 'column' }
              }
            } )
          ]
        } )
      ;
      // ----------------------------------------------------------
      // 
      source
        .flow( 'sequencer' )
        
        .trace().greedy()
      ;
    } ) // $amadeus()
  ;
} ); // module.export
