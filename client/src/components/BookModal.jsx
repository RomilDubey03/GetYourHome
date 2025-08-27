import React from "react";
import { Button, Modal, Select } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Label, Textarea, Radio } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import axios from "axios";

function BookModal({ listing }) {
  const { currentUser } = useSelector((state) => state.user);

  const [openModal, setOpenModal] = useState(false);
  const [modalPlacement, setModalPlacement] = useState("center");

    const [loading , setLoading] = useState(false)

  const [formData, setFormData] = useState({
    checkInDate: new Date(2023, 3, 30),
    checkOutDate: new Date(2023, 3, 30),
    appliedFor: "rent",
    bookerMessage: "",
  });

  function handleFormChange(e) {
    setFormData((prev) => {
      console.log({ ...prev, [e.target.name]: e.target.value });
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);

    try {
        
        setLoading(prev=>true)

        const {data} = await axios.post('/api/booking/create' , {
            ...formData,
            listingId : listing._id,
            ownerId : listing.userRef,
        })
        console.log(data);
        setOpenModal(false)

    } catch (error) {
        if(error.response){
            alert(error.response.data.message)
        }
        else{
            alert(error.message)
        }
    }
    setLoading(prev=>false)
  }

  return (
    <div>
      <Button
        onClick={() => (currentUser ? setOpenModal(true) : navigate("/"))}
        className="border-black w-full"
        gradientDuoTone="purpleToPink"
      >
        Book this place!
      </Button>

      <Modal
        show={openModal}
        position={modalPlacement}
        onClose={() => setOpenModal(false)}
        size={"4xl"}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header>Add Booking</Modal.Header>
          <Modal.Body>
            <div className="space-y-6 p-6">
              <fieldset className="flex max-w-md gap-4">
                <div className="flex items-center gap-2">
                  <Radio
                    onChange={handleFormChange}
                    id="united-state"
                    name="appliedFor"
                    value="rent"
                    defaultChecked
                  />
                  <Label htmlFor="united-state">Rent</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    onChange={handleFormChange}
                    id="germany"
                    name="appliedFor"
                    value="buy"
                  />
                  <Label htmlFor="germany">Buy</Label>
                </div>
              </fieldset>
              {formData.appliedFor == "rent" ? (
                <>
                  <Datepicker
                    id="start-date"
                    onSelectedDateChanged={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        ["checkInDate"]: date,
                      }))
                    }
                    minDate={new Date(2023, 0, 1)}
                    maxDate={new Date(2023, 3, 30)}
                  />
                  <Label htmlFor="start-date">check-in</Label>
                  <Datepicker
                    id="end-date"
                    onSelectedDateChanged={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        ["checkOutDate"]: date,
                      }))
                    }
                    minDate={new Date(2023, 0, 1)}
                    maxDate={new Date(2023, 11, 30)}
                  />
                  <Label htmlFor="end-date">check-out</Label>
                </>
              ) : null}
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label htmlFor="comment" value="Message to owner" />
                </div>
                <Textarea
                  id="comment"
                  name="bookerMessage"
                  placeholder="Leave a Message..."
                  required
                  rows={4}
                  maxLength={200}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {loading ? (<Button type="submit">Booking... </Button>) : (<Button type="submit">Submit Request</Button>)}
            <Button
              type="button"
              color="gray"
              onClick={() => setOpenModal(false)}
            >
              Decline
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default BookModal;
