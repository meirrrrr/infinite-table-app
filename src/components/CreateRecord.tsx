import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRecord } from "@/api/records";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CreateRecordPage: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fName = firstName.trim();
    const lName = lastName.trim();
    const eMail = email.trim();
    const phRaw = phone.trim();
    const ageValue = age;

    if (!fName || !lName || ageValue === "" || !eMail || !phRaw) {
      setError("Все поля обязательны.");
      return;
    }

    if (fName.length < 2) {
      setError("At least 2 digit for name");
      return;
    }
    if (lName.length < 2) {
      setError("At least 2 digit for last name");
      return;
    }

    const ageNum = Number(ageValue);
    if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setError("Age should be between 1 and 120");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(eMail)) {
      setError("Invalid format for email");
      return;
    }

    const digitsOnly = phRaw.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      setError("Phone number should contain 11 digit");
      return;
    }

    if (!digitsOnly.startsWith("7")) {
      setError("Phone number should start with 7");
      return;
    }

    setIsSubmitting(true);
    try {
      await createRecord({
        firstName: fName,
        lastName: lName,
        age: ageNum,
        email: eMail,
        phone: digitsOnly,
      });
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Create New Record</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label
                  htmlFor="age"
                  className="text-sm font-medium text-gray-700"
                >
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="Enter age"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  disabled={isSubmitting}
                />
              </div>
              <div className="md:col-span-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Add Record"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
