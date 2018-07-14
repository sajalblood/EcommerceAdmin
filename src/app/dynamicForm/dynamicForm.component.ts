import { Component, OnInit } from '@angular/core';
import { DynamicFormService } from '../service/dynamicForm.service';
import { HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getOrCreateTemplateRef } from '../../../node_modules/@angular/core/src/render3/di';
import { Router } from '../../../node_modules/@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './dynamicForm.component.html',
  styleUrls: ['./dynamicForm.component.css'],

})
export class DynamicFormComponent implements OnInit {
  heroForm: FormGroup;
  selectedFiles: FileList;
  formControl: any;
  currentFileUpload: File;
  form: FormGroup;
  formType: any;
  constructor(public dynamicFormService: DynamicFormService, private fb: FormBuilder, private router: Router) {
    this.formType = this.getType(this.router.url.toString())
    this.formControl = this.getTemplate();
    this.form = this.toFormGroup();
  }
  getType(type) {

    if (type.indexOf("product") == 1) {
      return "product"
    }
    else if (type.indexOf("user") == 1) {
      return "user"
    }
  }
  getTemplate() {
    switch (this.formType) {
      case "product":
        return [
          {
            fctrl: [{ "Dname": "Product Name", "name": "ProductName", "type": "input" },
            { "Dname": "Selling Price", "name": "SellingPrice", "type": "number" }]
          },
          {
            fctrl: [{ "Dname": "Cost Price", "name": "CostPrice", "type": "number" },
            { "Dname": "Brand", "name": "Brand", "type": "input" }]
          },
          {
            fctrl: [{ "Dname": "Quantity", "name": "Quantity", "type": "number" },
            { "Dname": "Category", "name": "Category", "type": "dropdown" }]
          },
          {
            fctrl: [{ "Dname": "Tags", "name": "Tags", "type": "dropdown" },
            { "Dname": "Detail", "name": "Detail", "type": "textarea" }]
          }
          ,
          { fctrl: [{ "Dname": "Select Image", "name": "image", "type": "file" }] }

        ];
      case "user":
        return [
          {
            fctrl: [{ "Dname": "Name", "name": "Name", "type": "input" },
            { "Dname": "Password", "name": "Password", "type": "pass" }]
          },
          {
            fctrl: [{ "Dname": "Country", "name": "Country", "type": "dropdown" },
            { "Dname": "Contact", "name": "Contact", "type": "number" }]
          },
          { fctrl: [{ "Dname": "Email", "name": "Email", "type": "email" }] }

        ];
    }
  }
  toFormGroup() {
    let group: any = {};
    this.formControl.forEach(x => {
      x.fctrl.forEach(y => {
        group[y.name] = new FormControl('', Validators.required);
      });
    });
    return new FormGroup(group);
  }

  ngOnInit() {
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
  onSubmit(form) {

    if (this.formType == "product") {
      console.log(this.selectedFiles.item(0));
      this.currentFileUpload = this.selectedFiles.item(0);
      this.upload();
      //this.dynamicFormService.addProduct(form.value);
    }
    else if (this.formType == "user")
      this.dynamicFormService.addUser(form.value);
  }
  upload() {

    this.dynamicFormService.uploadFile(this.currentFileUpload).subscribe(event => {
      if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        console.log(event);
      }
    });

    this.selectedFiles = undefined;

  }

}
