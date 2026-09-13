import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Spinner, Button, Input } from "reactstrap";

import Header from "components/Headers/Header.js";
import api, { getErrorMessage } from "Common/api";
import { badNotification, goodNotification } from "Common/Notification";

const FarmerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsumer, setSelectedConsumer] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("farmer/message");

      if (res.data?.statusCode === 200) {
        const result = res.data.result || [];

        setMessages(result);

        const unique = new Map();

        result.forEach((message) => {
          if (message.consumer?._id) {
            unique.set(
              message.consumer._id,
              message.consumer.username || "Consumer",
            );
          }
        });

        const list = Array.from(unique, ([id, username]) => ({
          id,
          username,
        }));

        setConsumers(list);

        setSelectedConsumer((previous) => {
          if (previous && list.some((consumer) => consumer.id === previous)) {
            return previous;
          }

          return list[0]?.id || "";
        });
      } else {
        badNotification(res.data?.message || "Unable to fetch messages");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to fetch messages"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const send = async () => {
    const message = text.trim();

    if (!selectedConsumer || !message || sending) {
      return;
    }

    setSending(true);

    try {
      const res = await api.post("farmer/message/send", {
        consumer: selectedConsumer,
        message,
      });

      if (res.data?.statusCode === 200) {
        goodNotification("Sent", "Message sent");
        setText("");
        await loadMessages();
      } else {
        badNotification(res.data?.message || "Unable to send message");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to send message"));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Header />

      <div className="container-fluid mt--7">
        <div className="row">
          <div className="col-lg-8">
            <Card className="shadow modern-card">
              <CardHeader className="border-0">
                <h3 className="mb-0">Messages</h3>
              </CardHeader>

              <CardBody>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="ni ni-chat-round h1 d-block mb-2" />
                    No messages yet. Consumers can reach you from a listing's
                    "Contact" button.
                  </div>
                ) : (
                  <div className="message-thread">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`message-bubble ${
                          Number(message.from) === 0 ? "me" : "them"
                        }`}
                      >
                        <div className="message-meta">
                          {Number(message.from) === 0
                            ? "You"
                            : message.consumer?.username || "Consumer"}
                        </div>

                        <div className="message-text">{message.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="col-lg-4">
            <Card className="shadow modern-card">
              <CardHeader className="border-0">
                <h4 className="mb-0">Reply</h4>
              </CardHeader>

              <CardBody>
                <Input
                  type="select"
                  className="mb-3"
                  value={selectedConsumer}
                  onChange={(e) => setSelectedConsumer(e.target.value)}
                  disabled={consumers.length === 0 || sending}
                >
                  {consumers.length === 0 && (
                    <option value="">No conversations yet</option>
                  )}

                  {consumers.map((consumer) => (
                    <option key={consumer.id} value={consumer.id}>
                      {consumer.username}
                    </option>
                  ))}
                </Input>

                <Input
                  type="textarea"
                  rows="4"
                  className="mb-3"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  disabled={sending}
                />

                <Button
                  color="primary"
                  className="w-100"
                  onClick={send}
                  disabled={sending || !text.trim() || !selectedConsumer}
                >
                  {sending ? <Spinner size="sm" /> : "Send"}
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerMessages;
