import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Hero} from '../../components/hero/hero';
import { Features} from '../../components/features/features';
import { Security } from '../../components/security/security';
import { Company } from '../../components/company/company';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
 
    Hero, 
    Features, 
    Security, 
    Company, 
 
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home{}