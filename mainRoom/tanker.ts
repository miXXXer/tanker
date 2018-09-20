
import { Room, EntityMap, Client, nosync } from "colyseus";

export class State {
    players: EntityMap<Player> = {};

    @nosync
    something = "This attribute won't be sent to the client-side";

    createPlayer (id: string) {
        this.players[ id ] = new Player();
    }

    removePlayer (id: string) {
        delete this.players[ id ];
    }

    movePlayer (id: string, movement: any) {
        if (movement.x) {
            this.players[ id ].x += movement.x * 3;

        } else if (movement.y) {
            this.players[ id ].y -= movement.y * 3;
        }
    }
}

export class Player {
    rotation = 0;
    x =  Math.floor(Math.random() * 500) + 50;
    y = Math.floor(Math.random() * 300) + 50;
    team = (Math.floor(Math.random() * 2) == 0) ? 'jacek' : 'denis';
}

export class TankerRoom extends Room<State> {
    onInit (options) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new State());
    }

    onJoin (client) {
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log("TankerRoom received message from", client.sessionId, ":", data);
        this.state.movePlayer(client.sessionId, data);
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}