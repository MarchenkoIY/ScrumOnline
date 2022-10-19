class chatModel {
    static async getMessages(counter) {
        let response = await fetch('http://localhost:3000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({counter: counter})
        });
        return await response.json();
    }

    static async sendMessage(author, text) {

        await fetch('http://localhost:3000/message', {
            method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({author: author, text: text}),
        });
    }
}

export default chatModel;