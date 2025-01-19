// "use client";

import { FileUploader } from "@/components/ui/file-uploader";
import { Shell } from "@/components/ui/shell";

// import { useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// import {
//   ItemFormPropsValue,
//   ItemsFormPropsValueKeys,
//   ItemsNameType,
// } from "@/types/items";
// import { itemsSchema } from "@/config/items-add";
// import { DatetimePicker } from "@/components/ui/date-time-picker";
// import { FileUploader } from "@/components/ui/file-uploader-primitive";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Icons } from "@/components/ui/icons";
// import { FloatingLabelInput, InputNumber } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// interface ItemsFormProps<T extends ItemsNameType> {
//   index: number;
//   itemNameType: ItemsNameType;
//   defaultValues: ItemFormPropsValue[T];
//   onFormChangeAction: (index: number, value: ItemFormPropsValue[T]) => void;
//   hiddenFields?: ItemsFormPropsValueKeys<T>[];
// }

// export default function ItemsForm<T extends ItemsNameType>({
//   index,
//   itemNameType,
//   defaultValues,
//   onFormChangeAction,
//   hiddenFields = [],
// }: ItemsFormProps<T>) {
//   const form = useForm<ItemFormPropsValue[typeof itemNameType]>({
//     resolver: zodResolver(itemsSchema[itemNameType]),
//     defaultValues,
//   });

//   useEffect(() => {
//     if ("code" in defaultValues && defaultValues.code) {
//       form.setValue(
//         "code",
//         defaultValues.code.length > 1
//           ? defaultValues.code
//           : isNaN(parseInt(defaultValues.code))
//             ? defaultValues.code
//             : ""
//       );
//     }

//     if ("codeDuplicate" in defaultValues && defaultValues.codeDuplicate) {
//       form.setValue("codeDuplicate", defaultValues.codeDuplicate);
//     }
//   }, [defaultValues]);

//   const isFieldHidden = (fieldName: any) => hiddenFields.includes(fieldName);

//   const getFieldError = (fieldName: any) =>
//     defaultValues.errors?.find((error) => error?.path === fieldName)?.message ??
//     "";

//   return (
//     <Form {...form}>
//       <form
//         onChange={() =>
//           onFormChangeAction(index, form.getValues() as ItemFormPropsValue[T])
//         }
//         className="p-4"
//       >
//         <div className="ml-auto mr-auto h-full max-w-fit">
//           <div className="flex h-full w-72 flex-col items-center gap-6">
//             {itemNameType === "issues" && (
//               <>
//                 {!isFieldHidden("name") && (
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormLabel>Issue General Information</FormLabel>
//                         <FormControl>
//                           <FloatingLabelInput
//                             {...field}
//                             id="name"
//                             label="Issue Name"
//                           />
//                         </FormControl>
//                         <FormMessage>{getFieldError("name")}</FormMessage>
//                       </FormItem>
//                     )}
//                   />
//                 )}
//                 {!isFieldHidden("act") && (
//                   <FormField
//                     control={form.control}
//                     name="act"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormControl>
//                           <FloatingLabelInput
//                             {...field}
//                             id="act"
//                             label="Issue Act"
//                             className="w-full"
//                           />
//                         </FormControl>
//                         <FormMessage>{getFieldError("act")}</FormMessage>
//                       </FormItem>
//                     )}
//                   />
//                 )}
//                 {!isFieldHidden("group") && (
//                   <FormField
//                     control={form.control}
//                     name="group"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormControl>
//                           <FloatingLabelInput
//                             {...field}
//                             id="group"
//                             label="Issue Group"
//                           />
//                         </FormControl>
//                         <FormMessage>{getFieldError("group")}</FormMessage>
//                       </FormItem>
//                     )}
//                   />
//                 )}
//                 {!isFieldHidden("code") && (
//                   <FormField
//                     control={form.control}
//                     name="code"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormLabel className="flex justify-between">
//                           <div>
//                             Issue Code
//                             <Typography variant="muted" className="text-xs">
//                               Generated by default.
//                             </Typography>
//                           </div>
//                           <TooltipProvider>
//                             <Tooltip>
//                               <TooltipTrigger
//                                 disabled
//                                 className="cursor-pointer"
//                               >
//                                 <Icons.info size={16} />
//                               </TooltipTrigger>
//                               <TooltipContent>
//                                 <p>Code is generated as follows:</p>
//                                 <ul className="ml-4 list-disc">
//                                   <li>First and Last letters of Name</li>
//                                   <li>First two letters of Act (no spaces)</li>
//                                   <li>
//                                     First two letters of Group (no spaces)
//                                   </li>
//                                   <li>Rarity number</li>
//                                 </ul>
//                                 <p>
//                                   <code>
//                                     Name: IU, Act: Last Fantasy, Group: Soloist,
//                                     Rarity: 1
//                                   </code>
//                                 </p>
//                                 <p>
//                                   <code>Code: IULASO1</code>
//                                 </p>
//                               </TooltipContent>
//                             </Tooltip>
//                           </TooltipProvider>
//                         </FormLabel>
//                         <FormControl>
//                           <FloatingLabelInput
//                             {...field}
//                             id="code"
//                             label="Issue Code"
//                             disabled={
//                               "codeDuplicate" in defaultValues &&
//                               !defaultValues.codeDuplicate
//                             }
//                           />
//                         </FormControl>
//                         <FormMessage>{getFieldError("code")}</FormMessage>
//                       </FormItem>
//                     )}
//                   />
//                 )}
//                 {!isFieldHidden("rarity") && (
//                   <>
//                     <Separator className="my-1" />
//                     <FormField
//                       control={form.control}
//                       name="rarity"
//                       render={({ field, fieldState }) => (
//                         <FormItem className="w-full">
//                           <FormLabel>Issue Rarity</FormLabel>
//                           <FormControl>
//                             <Select
//                               onValueChange={(value) => {
//                                 form.setValue("rarity", parseInt(value));
//                               }}
//                               value={field.value.toString()}
//                             >
//                               <SelectTrigger className="w-full">
//                                 <SelectValue placeholder="Select the Issue Rarity" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectGroup>
//                                   <SelectLabel>Issue Rarity</SelectLabel>
//                                   {Array.from({ length: 5 }).map((_, index) => (
//                                     <SelectItem
//                                       key={index}
//                                       value={(index + 1).toString()}
//                                     >
//                                       <div className="flex items-center gap-2">
//                                         {Array.from({ length: index + 1 }).map(
//                                           (_, starIndex) => (
//                                             <Icons.star
//                                               key={starIndex}
//                                               size={16}
//                                             />
//                                           )
//                                         )}
//                                       </div>
//                                     </SelectItem>
//                                   ))}
//                                 </SelectGroup>
//                               </SelectContent>
//                             </Select>
//                           </FormControl>
//                           <FormMessage>{getFieldError("rarity")}</FormMessage>
//                         </FormItem>
//                       )}
//                     />
//                   </>
//                 )}
//                 {!isFieldHidden("releaseDate") && (
//                   <FormField
//                     control={form.control}
//                     name="releaseDate"
//                     render={({ field }) => (
//                       <FormItem className="w-full">
//                         <FormLabel>Release Date</FormLabel>
//                         <FormControl>
//                           <DatetimePicker
//                             disabled
//                             value={field.value}
//                             action={() => {}}
//                           />
//                         </FormControl>
//                         <FormMessage>
//                           {getFieldError("releaseDate")}
//                         </FormMessage>
//                       </FormItem>
//                     )}
//                   />
//                 )}
//                 {!isFieldHidden("image") && (
//                   <>
//                     <Separator className="my-1" />
//                     <FormField
//                       control={form.control}
//                       name="image"
//                       render={() => (
//                         <FormItem className="w-full">
//                           <FormLabel>Issue Image</FormLabel>
//                           <FormControl>
//                             <FileUploader
//                               value={
//                                 form.getValues("image")?.name &&
//                                 form.getValues("image").name !== "filename"
//                                   ? [form.getValues("image")]
//                                   : []
//                               }
//                               previewHeight={150}
//                               previewWidth={150}
//                               onValueChange={(value) => {
//                                 form.setValue("image", value[0]);
//                                 onFormChangeAction(
//                                   index,
//                                   form.getValues() as ItemFormPropsValue[T]
//                                 );
//                               }}
//                             />
//                           </FormControl>
//                           <FormMessage>{getFieldError("image")}</FormMessage>
//                         </FormItem>
//                       )}
//                     />
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </form>
//     </Form>
//   );
// }

export default function AddForm() {
  return (
    <Shell variant="centered">
      <FileUploader maxSize={1024 * 1024 * 8} />
    </Shell>
  );
}
