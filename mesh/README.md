# mesh

distributed p2p event emitter mesh

## API

#### [properties](#mesh-properties)

  - [id](#mesh-properties-id)


#### [methods](#mesh-methods)

  - [connect](#mesh-methods-connect) (options, callback)

  - [listen](#mesh-methods-listen) (options, callback)


distributed p2p event emitter mesh

- **id** 

  - **type** : any


<a name="mesh-methods"></a> 

## methods 

<a name="mesh-methods-connect"></a> 

### mesh.connect(options, callback)

Connect to the big mesh 

- **options** 

  - **type** : object

  - **properties**

    - **port** 

      - **type** : number

      - **default** : 7777

      - **description** : the port of the node

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

      - **description** : the host of the node

- **callback** 

  - **description** : the callback executed after connecting to mesh

  - **type** : function

  - **required** : false

<a name="mesh-methods-listen"></a> 

### mesh.listen(options, callback)

Listens for incoming big instances

- **options** 

  - **type** : object

  - **properties**

    - **port** 

      - **type** : number

      - **default** : 7777

      - **description** : the port of the node

    - **host** 

      - **type** : string

      - **default** : 0.0.0.0

      - **description** : the host of the node

- **callback** 

  - **description** : the callback executed after connecting to mesh

  - **type** : function

  - **required** : false


{"engine.io":"*","engine.io-client":"*"}
*README auto-generated with [docs](https://github.com/bigcompany/resources/tree/master/docs)*