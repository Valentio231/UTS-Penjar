package main

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	Hub  *Hub
	Conn *websocket.Conn
	Send chan Message
}

func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()

	for {
		var msg Message
		if err := c.Conn.ReadJSON(&msg); err != nil {
			break
		}

		c.Hub.Broadcast <- msg
	}
}

func (c *Client) WritePump() {
	defer c.Conn.Close()
	for {
		msg, ok := <-c.Send
		if !ok {
			return
		}

		c.Conn.WriteJSON(msg)
	}
}
