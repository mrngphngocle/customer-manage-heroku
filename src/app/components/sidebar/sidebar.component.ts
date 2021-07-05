import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @ViewChild('password') password: ElementRef;

  constructor(private uploadService: FileUploadService) {}

  seenEasterEgg1(): void {
    alert('Cảm ơn em!');
    this.uploadService.seenEasterEgg1();
  }

  seenEasterEgg2WithoutReply(): void {
    this.uploadService.seenEasterEgg2withoutReply();
  }

  seenEasterEgg1WithoutReply(): void {
    this.uploadService.seenEasterEgg1WithoutReply();
  }

  seenEasterEgg2Yes(): void {
    alert('Cảm ơn em!');
    this.uploadService.seenEasterEgg2('YES');
  }

  seenEasterEgg2No(): void {
    alert('Cảm ơn em!');
    this.uploadService.seenEasterEgg2('NO');
  }

  focusPassword(): void {
    $('#password').focus();
  }

  getPassword(): string {
    return this.password.nativeElement.value;
  }

  resetPassword(): void {
    this.password.nativeElement.value = '';
  }

  checkPassword(): void {
    if (this.getPassword() == '04061999') {
      this.resetPassword();
      $('#easterEgg2').modal('hide');
      $('#confess').modal('show');
      this.seenEasterEgg2WithoutReply()
    } else {
      alert('Chưa đúng rồi! Nếu muốn thì thử lại nhe em!');
      this.resetPassword();
      this.uploadService.easterEgg2WrongPass()
    }
  }

  ngOnInit(): void {
    // $("#avatar").click(function(){
    //   $(".list-sidebar").each(function() {
    //     if ($(this).hasClass("active-sidebar")) $(this).removeClass("active-sidebar")
    //     else $(this).addClass("active-sidebar")
    // });
    // })

    $('.list-sidebar').click(function () {
      $(this).addClass('clicked');
      $('.list-sidebar').each(function () {
        if ($(this).hasClass('clicked'))
          $(this).removeClass().addClass('active-sidebar list-sidebar');
        else $(this).removeClass().addClass('list-sidebar');
      });
    });

    $('#password').keyup(function (event) {
      if (event.keyCode === 13) {
        $('#btnCheck').click();
      }
    });
  }
}
