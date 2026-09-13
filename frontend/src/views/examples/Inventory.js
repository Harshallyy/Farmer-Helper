import {
  Form,
  Card,
  CardHeader,
  Label,
  Table,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Badge,
} from "reactstrap";

import Header from "components/Headers/Header.js";
import { useCallback, useEffect, useState } from "react";
import api, { getErrorMessage } from "Common/api";
import { goodNotification, badNotification } from "Common/Notification";

const CROPS = ["Rice", "Wheat", "Bajra", "Moong", "Jowar", "Urad", "Maize"];

const EMPTY_ITEM = {
  crop: "Rice",
  quantity: 0,
  units: "Kg",
  price: 0,
};

const Inventory = () => {
  const [editIndex, setEditIndex] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState(EMPTY_ITEM);

  const getInventory = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("farmer/inventory");

      if (res.data?.statusCode === 200) {
        setItems(res.data.result || []);
      } else {
        badNotification(res.data?.message || "Unable to fetch inventory");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to fetch inventory"));
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async () => {
    if (saving) return;

    setSaving(true);

    try {
      const payload = {
        ...newItem,
        quantity: Number(newItem.quantity),
        price: Number(newItem.price),
      };

      const res = await api.post("farmer/inventory/add", payload);

      if (res.data?.statusCode === 200) {
        goodNotification("Add Inventory", "Item successfully added");

        setModal(false);
        setNewItem({ ...EMPTY_ITEM });
        await getInventory();
      } else {
        badNotification(res.data?.message || "Unable to add item");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to add item"));
    } finally {
      setSaving(false);
    }
  };

  const confirmEdit = async () => {
    if (!editOrder || saving) return;

    const body = {
      crop: editOrder.crop,
      quantity: Number(editOrder.quantity),
      units: editOrder.units,
      price: Number(editOrder.price),
      _id: editOrder._id,
      user_id: editOrder.farmerId,
    };

    setSaving(true);

    try {
      const res = await api.put("farmer/inventory/update", body);

      if (res.data?.statusCode === 200) {
        goodNotification("Edit Item", "Item edited successfully");

        setEditIndex(null);
        setEditOrder(null);
        await getInventory();
      } else {
        badNotification(res.data?.message || "Unable to edit item");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to edit item"));
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Remove this item from your inventory?")) {
      return;
    }

    try {
      const res = await api.delete(`farmer/inventory/remove/${id}`);

      if (res.data?.statusCode === 200) {
        goodNotification("Removed", "Item removed from inventory");
        await getInventory();
      } else {
        badNotification(res.data?.message || "Unable to remove item");
      }
    } catch (err) {
      badNotification(getErrorMessage(err, "Unable to remove item"));
    }
  };

  const handleEdit = (item) => {
    if (editIndex === item._id) {
      setEditIndex(null);
      setEditOrder(null);
      return;
    }

    setEditIndex(item._id);
    setEditOrder({
      ...item,
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
      units: item.units || "Kg",
    });
  };

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  return (
    <>
      <Header />

      <div className="container-fluid mt--7">
        <div className="row">
          <div className="col">
            <Card className="shadow modern-card">
              <CardHeader className="border-0 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <h3 className="mb-0">Inventory</h3>

                <Button
                  color="primary"
                  className="btn-icon"
                  onClick={() => setModal(true)}
                  disabled={saving}
                >
                  <i className="ni ni-fat-add me-1" /> Add Item
                </Button>
              </CardHeader>

              <Modal isOpen={modal} toggle={() => !saving && setModal(!modal)}>
                <ModalHeader toggle={() => !saving && setModal(!modal)}>
                  Add Item
                </ModalHeader>

                <ModalBody>
                  <Form>
                    <FormGroup>
                      <Label>Crop</Label>
                      <Input
                        type="select"
                        value={newItem.crop}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            crop: e.target.value,
                          })
                        }
                      >
                        {CROPS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        value={newItem.quantity}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            quantity: e.target.value,
                          })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Units</Label>
                      <Input
                        type="text"
                        value={newItem.units}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            units: e.target.value,
                          })
                        }
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        min="0"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            price: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Form>
                </ModalBody>

                <ModalFooter>
                  <Button color="primary" onClick={addItem} disabled={saving}>
                    {saving ? <Spinner size="sm" /> : "Add"}
                  </Button>

                  <Button
                    color="secondary"
                    outline
                    onClick={() => setModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="ni ni-box-2 h1 d-block mb-2" />
                  No items in your inventory yet. Click "Add Item" to get
                  started.
                </div>
              ) : (
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Crop</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Price</th>
                      <th scope="col">Edit</th>
                      <th scope="col" />
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {editIndex !== item._id ? (
                            <span>{item.crop}</span>
                          ) : (
                            <Input
                              type="select"
                              value={editOrder?.crop || ""}
                              onChange={(e) =>
                                setEditOrder({
                                  ...editOrder,
                                  crop: e.target.value,
                                })
                              }
                            >
                              {CROPS.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </Input>
                          )}
                        </td>

                        <td>
                          {editIndex !== item._id ? (
                            <Badge color="" className="badge-dot">
                              {item.quantity} {item.units}
                            </Badge>
                          ) : (
                            <FormGroup row className="mb-0">
                              <div className="col-6">
                                <Input
                                  type="number"
                                  min="0"
                                  value={editOrder?.quantity ?? 0}
                                  onChange={(e) =>
                                    setEditOrder({
                                      ...editOrder,
                                      quantity: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="col-6">
                                <Input
                                  type="text"
                                  value={editOrder?.units || ""}
                                  onChange={(e) =>
                                    setEditOrder({
                                      ...editOrder,
                                      units: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </FormGroup>
                          )}
                        </td>

                        <td>
                          {editIndex !== item._id ? (
                            <span>&#8377; {item.price}</span>
                          ) : (
                            <Input
                              type="number"
                              min="0"
                              value={editOrder?.price ?? 0}
                              onChange={(e) =>
                                setEditOrder({
                                  ...editOrder,
                                  price: e.target.value,
                                })
                              }
                            />
                          )}
                        </td>

                        <td>
                          <Button
                            size="sm"
                            color="secondary"
                            outline
                            onClick={() => handleEdit(item)}
                            disabled={saving}
                          >
                            {editIndex !== item._id ? "Edit" : "Cancel"}
                          </Button>
                        </td>

                        <td className="text-end">
                          {editIndex === item._id ? (
                            <Button
                              size="sm"
                              color="primary"
                              onClick={confirmEdit}
                              disabled={saving}
                            >
                              {saving ? <Spinner size="sm" /> : "Confirm"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              color="danger"
                              outline
                              onClick={() => removeItem(item._id)}
                              disabled={saving}
                            >
                              <i className="ni ni-fat-remove" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
