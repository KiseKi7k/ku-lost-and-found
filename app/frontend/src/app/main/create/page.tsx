"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageDropzone from "@/components/ImageDropzone";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  itemName: z.string().nonempty({ error: "กรุณาระบุสิ่งของ" }),
  image: z.file({ error: "โปรดอัพโหลดรูปภาพ" }),
  foundLocation: z.string().nonempty({ error: "กรุณาระบุสถานที่ที่พบ" }),
  foundAt: z.date(),
  depositLocation: z.string().nonempty({ error: "กรุณาระบุสถานที่ที่นำไปฝาก" }),
});

const CreatePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      image: undefined,
      foundLocation: "",
      foundAt: new Date(),
      depositLocation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      form.reset();
    }, 5000);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 animate-fade-in flex self-start">
        เเจ้งของหาย
      </h1>

      <Card className="max-w-4xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">รายงานของหาย</CardTitle>
          <CardDescription>โปรดกรอกรายละเอียดในฟอร์ม</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline">
                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>สิ่งของ</FormLabel>
                      <FormControl>
                        <Input placeholder="ตย. Iphone12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="foundLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>พบที่</FormLabel>
                      <FormControl>
                        <Input placeholder="ตย. บาร์วิศวะ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="foundAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>พบเมื่อ</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depositLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ฝากไว้ที่</FormLabel>
                      <FormControl>
                        <Input placeholder="ตย. ยามบาร์วิศวะ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col items-center mt-8">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <ImageDropzone
                        onChange={field.onChange}
                        value={field.value}
                      />
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="mx-auto mt-8 w-full max-w-xs items-center flex"
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : "รายงาน"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePage;
